import {
    createContext, useContext, useState, useEffect,
    useCallback, type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { type SheetUser } from '../lib/sheets'

// ── Internal DB row shape ─────────────────────────────────
interface UserRow {
    id:         string
    email:      string
    first_name: string
    last_name:  string
    phone:      string
    is_pro:     boolean
    created_at: string
}

// ── Public types — contrato IDÉNTICO al original ──────────
interface User { id: string; email: string }

interface Profile {
    first_name:   string
    last_name:    string
    phone:        string
    prompt_count: number
    is_pro:       boolean
}

interface AuthContextType {
    user:                 User | null
    profile:              Profile | null
    isLoading:            boolean
    showAuth:             boolean
    setShowAuth:          (v: boolean) => void
    signUp:               (email: string, password: string, meta: { first_name: string; last_name: string; phone: string }) => Promise<{ error: string | null }>
    signIn:               (email: string, password: string) => Promise<{ error: string | null }>
    signOut:              () => Promise<void>
    incrementPromptCount: () => Promise<number>
    fullUser:             SheetUser | null
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// ── Helpers ───────────────────────────────────────────────
function rowToSheetUser(row: UserRow): SheetUser {
    return {
        id:           row.id,
        firstName:    row.first_name,
        lastName:     row.last_name,
        email:        row.email,
        phone:        row.phone,
        isPro:        row.is_pro,
        sessionCount: 0,
        totalMinutes: 0,
    }
}

function toUser(u: SheetUser): User { return { id: u.id, email: u.email } }

function toProfile(u: SheetUser, promptCount: number): Profile {
    return {
        first_name:   u.firstName,
        last_name:    u.lastName,
        phone:        u.phone,
        prompt_count: promptCount,
        is_pro:       u.isPro,
    }
}

// Race any promise against a timeout — rejects with a generic error if too slow
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), ms)
        ),
    ])
}

function translateError(msg: string): string {
    const m = msg.toLowerCase()
    if (m === 'timeout') return 'La conexión tardó demasiado. Verifica tu internet e inténtalo de nuevo.'
    if (m.includes('already registered') || m.includes('already been registered'))
        return 'Este correo ya tiene una cuenta. Usa "Iniciar sesión".'
    if (m.includes('invalid login credentials') || m.includes('invalid credentials'))
        return 'Correo o contraseña incorrectos.'
    if (m.includes('email not confirmed'))
        return 'Revisa tu correo y confirma tu cuenta antes de iniciar sesión.'
    if (m.includes('password') && (m.includes('least') || m.includes('short')))
        return 'La contraseña debe tener al menos 6 caracteres.'
    if (m.includes('rate limit') || m.includes('too many requests') || m.includes('over_email'))
        return 'Demasiados intentos. Espera un momento e intenta de nuevo.'
    if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch'))
        return 'Sin conexión. Verifica tu internet e inténtalo de nuevo.'
    if (m.includes('weak_password') || m.includes('weak password'))
        return 'Contraseña muy débil. Usa al menos 6 caracteres con números o símbolos.'
    return 'Error al procesar. Intenta de nuevo.'
}

// ── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [fullUser,    setFullUser]    = useState<SheetUser | null>(null)
    const [promptCount, setPromptCount] = useState(0)
    const [isLoading,   setIsLoading]   = useState(true)
    const [showAuth,    setShowAuth]    = useState(false)

    useEffect(() => {
        let mounted = true

        // Never block the UI more than 4s on initial session check
        const timeout = setTimeout(() => { if (mounted) setIsLoading(false) }, 4000)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!mounted) return

                if (session?.user) {
                    try {
                        const { data } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()

                        if (!mounted) return
                        setFullUser(data ? rowToSheetUser(data as UserRow) : null)
                    } catch {
                        if (mounted) setFullUser(null)
                    }
                } else {
                    if (mounted) setFullUser(null)
                }

                if (mounted) {
                    clearTimeout(timeout)
                    setIsLoading(false)
                }
            }
        )

        return () => {
            mounted = false
            clearTimeout(timeout)
            subscription.unsubscribe()
        }
    }, [])

    const user    = fullUser ? toUser(fullUser)                 : null
    const profile = fullUser ? toProfile(fullUser, promptCount) : null

    // ── signUp ────────────────────────────────────────────
    const signUp = useCallback(async (
        email:    string,
        password: string,
        meta:     { first_name: string; last_name: string; phone: string }
    ): Promise<{ error: string | null }> => {
        try {
            const { data, error } = await withTimeout(
                supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { first_name: meta.first_name, last_name: meta.last_name, phone: meta.phone } },
                }),
                12000
            )
            if (error) return { error: translateError(error.message) }
            if (!data.user) return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }

            // Explicitly create profile — belt + suspenders alongside DB trigger
            await supabase.from('users').upsert({
                id:         data.user.id,
                email:      data.user.email ?? email,
                first_name: meta.first_name,
                last_name:  meta.last_name,
                phone:      meta.phone,
                is_pro:     false,
            }, { onConflict: 'id' })

            await supabase.from('user_credits').upsert(
                { user_id: data.user.id, credits: 3 },
                { onConflict: 'user_id', ignoreDuplicates: true }
            )

            return { error: null }
        } catch (e: unknown) {
            return { error: translateError((e as Error)?.message ?? '') }
        }
    }, [])

    // ── signIn ────────────────────────────────────────────
    const signIn = useCallback(async (
        email:    string,
        password: string
    ): Promise<{ error: string | null }> => {
        try {
            const { error } = await withTimeout(
                supabase.auth.signInWithPassword({ email, password }),
                12000
            )
            if (error) return { error: translateError(error.message) }
            return { error: null }
        } catch (e: unknown) {
            return { error: translateError((e as Error)?.message ?? '') }
        }
    }, [])

    // ── signOut ───────────────────────────────────────────
    const signOut = useCallback(async () => {
        try { await supabase.auth.signOut() } catch { /* ignore */ }
        setFullUser(null)
        setPromptCount(0)
    }, [])

    // ── incrementPromptCount ──────────────────────────────
    const incrementPromptCount = useCallback(async (): Promise<number> => {
        const next = promptCount + 1
        setPromptCount(next)
        return next
    }, [promptCount])

    return (
        <AuthContext.Provider value={{
            user, profile, isLoading, showAuth, setShowAuth,
            signUp, signIn, signOut, incrementPromptCount,
            fullUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
