import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { sheets, type SheetUser } from '../lib/sheets'

// ── Types (compatible interface with previous Supabase version) ──
interface User { id: string; email: string }

interface Profile {
    first_name: string
    last_name: string
    phone: string
    prompt_count: number
    is_pro: boolean
}

interface AuthContextType {
    user: User | null
    profile: Profile | null
    isLoading: boolean
    showAuth: boolean
    setShowAuth: (v: boolean) => void
    signUp: (email: string, _password: string, meta: { first_name: string; last_name: string; phone: string }) => Promise<{ error: string | null }>
    signIn: (email: string, _password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
    incrementPromptCount: () => Promise<number>
    // Extended: full user data for session tracker & retention
    fullUser: SheetUser | null
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const LS_KEY = 'vp_user'

function saveLocal(u: SheetUser) {
    localStorage.setItem(LS_KEY, JSON.stringify(u))
}

function loadLocal(): SheetUser | null {
    try {
        const raw = localStorage.getItem(LS_KEY)
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

function toUser(u: SheetUser): User { return { id: u.id, email: u.email } }
function toProfile(u: SheetUser, promptCount: number): Profile {
    return {
        first_name: u.firstName,
        last_name: u.lastName,
        phone: u.phone,
        prompt_count: promptCount,
        is_pro: u.isPro,
    }
}

// ── Provider ──────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [fullUser, setFullUser] = useState<SheetUser | null>(null)
    const [promptCount, setPromptCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [showAuth, setShowAuth] = useState(false)

    // On mount, restore session from localStorage
    useEffect(() => {
        const saved = loadLocal()
        if (saved) setFullUser(saved)
        setIsLoading(false)
    }, [])

    const user = fullUser ? toUser(fullUser) : null
    const profile = fullUser ? toProfile(fullUser, promptCount) : null

    const signUp = useCallback(async (
        email: string,
        _password: string,
        meta: { first_name: string; last_name: string; phone: string }
    ): Promise<{ error: string | null }> => {
        try {
            const res = await sheets.register(meta.first_name, meta.last_name, email, meta.phone)
            if (!res.success) return { error: res.error || 'Error al registrarse' }
            const u: SheetUser = res.user
            saveLocal(u)
            setFullUser(u)
            return { error: null }
        } catch (err) {
            return { error: 'Error de conexión. Intenta de nuevo.' }
        }
    }, [])

    const signIn = useCallback(async (email: string, _password: string): Promise<{ error: string | null }> => {
        try {
            const res = await sheets.login(email)
            if (!res.success) return { error: res.error || 'No se encontró la cuenta' }
            const u: SheetUser = res.user
            saveLocal(u)
            setFullUser(u)
            return { error: null }
        } catch (err) {
            return { error: 'Error de conexión. Intenta de nuevo.' }
        }
    }, [])

    const signOut = useCallback(async () => {
        localStorage.removeItem(LS_KEY)
        setFullUser(null)
        setPromptCount(0)
    }, [])

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
