import {
    createContext, useContext, useState, useEffect,
    useCallback, type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { sheets, type SheetUser } from '../lib/sheets'

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
    isSupabaseDown:       boolean
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
    if (m === 'timeout' || m.includes('abort') || m.includes('cancelled'))
        return 'La conexión está tardando. Espera unos segundos e intenta de nuevo, o si ya creaste tu cuenta, ve a "Iniciar sesión".'
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
    const [fullUser,        setFullUser]        = useState<SheetUser | null>(null)
    const [promptCount,     setPromptCount]     = useState(0)
    const [isLoading,       setIsLoading]       = useState(true)
    const [isSupabaseDown,  setIsSupabaseDown]  = useState(false)
    const [showAuth,        setShowAuth]        = useState(false)

    useEffect(() => {
        let mounted = true
        let requestVersion = 0

        // Never block the UI more than 4s on initial session check
        const timeout = setTimeout(() => { if (mounted) setIsLoading(false) }, 4000)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!mounted) return

                const myVersion = ++requestVersion

                if (session?.user) {
                    try {
                        const { data } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()

                        if (!mounted || myVersion !== requestVersion) return

                        if (data) {
                            setFullUser(rowToSheetUser(data as UserRow))
                        } else {
                            // Profile missing — create it now (parallel writes for speed).
                            const m = session.user.user_metadata ?? {}
                            await Promise.all([
                                supabase.from('users').upsert({
                                    id:         session.user.id,
                                    email:      session.user.email ?? '',
                                    first_name: (m.first_name ?? '') as string,
                                    last_name:  (m.last_name  ?? '') as string,
                                    phone:      (m.phone      ?? '') as string,
                                    is_pro:     false,
                                }, { onConflict: 'id' }),
                                supabase.from('user_credits').upsert(
                                    { user_id: session.user.id, credits: 3 },
                                    { onConflict: 'user_id', ignoreDuplicates: true }
                                ),
                            ])

                            if (!mounted || myVersion !== requestVersion) return
                            const { data: d2 } = await supabase
                                .from('users').select('*').eq('id', session.user.id).single()
                            setFullUser(d2 ? rowToSheetUser(d2 as UserRow) : null)
                        }
                    } catch (e: unknown) {
                        if (mounted && myVersion === requestVersion) {
                            const msg = (e as Error)?.message?.toLowerCase() ?? ''
                            const isNetworkError = msg.includes('fetch') || msg.includes('network') || msg.includes('failed')
                            if (isNetworkError) setIsSupabaseDown(true)
                            setFullUser(null)
                        }
                    }
                } else {
                    if (mounted && myVersion === requestVersion) {
                        setIsSupabaseDown(false)
                        setFullUser(null)
                    }
                }

                if (mounted && myVersion === requestVersion) {
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
                20000
            )

            if (error) {
                const m = error.message.toLowerCase()
                // Email already exists = previous signup succeeded but network timed out on the browser.
                // Attempt silent sign-in with same credentials to recover the session.
                if (m.includes('already registered') || m.includes('already been registered')) {
                    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
                    if (!signInErr) return { error: null }
                }
                return { error: translateError(error.message) }
            }
            if (!data.user) return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }

            // Fire-and-forget — DB trigger already handles profile creation.
            // These are backup only and must NOT block or fail the signup flow.
            const uid = data.user.id
            const uemail = data.user.email ?? email
            void (async () => {
                // DB backup writes — isolated from Sheets so a webhook failure
                // can never abort the upserts mid-flight.
                try {
                    await Promise.all([
                        supabase.from('users').upsert({
                            id:         uid,
                            email:      uemail,
                            first_name: meta.first_name,
                            last_name:  meta.last_name,
                            phone:      meta.phone,
                            is_pro:     false,
                        }, { onConflict: 'id' }),
                        supabase.from('user_credits').upsert(
                            { user_id: uid, credits: 3 },
                            { onConflict: 'user_id', ignoreDuplicates: true }
                        ),
                    ])
                } catch (err) {
                    console.error('[signUp] backup DB write failed:', err)
                }
                // Sheets CRM — non-critical, runs after DB to never block it
                try {
                    await sheets.register(meta.first_name, meta.last_name, uemail, meta.phone)
                } catch (err) {
                    console.error('[signUp] sheets.register failed (non-critical):', err)
                }
            })()

            return { error: null }
        } catch (e: unknown) {
            const msg = (e as Error)?.message ?? ''
            const isNetworkError = msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')
            if (isNetworkError) setIsSupabaseDown(true)
            return { error: translateError(msg) }
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
                30000
            )
            if (error) return { error: translateError(error.message) }
            setIsSupabaseDown(false)
            return { error: null }
        } catch (e: unknown) {
            const msg = (e as Error)?.message ?? ''
            const isNetworkError = msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network') || msg.toLowerCase().includes('timeout')
            if (isNetworkError) setIsSupabaseDown(true)
            return { error: translateError(msg) }
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
            user, profile, isLoading, isSupabaseDown, showAuth, setShowAuth,
            signUp, signIn, signOut, incrementPromptCount,
            fullUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
