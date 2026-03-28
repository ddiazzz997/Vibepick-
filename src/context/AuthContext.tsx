import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import fpPromise from '@fingerprintjs/fingerprintjs'

/* ── Types ── */
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
    signUp: (email: string, password: string, meta: { first_name: string; last_name: string; phone: string }) => Promise<{ error: string | null }>
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
    incrementPromptCount: () => Promise<number>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showAuth, setShowAuth] = useState(false)

    /* Fetch profile from users_profile table */
    const fetchProfile = useCallback(async (userId: string) => {
        const { data } = await supabase
            .from('users_profile')
            .select('*')
            .eq('id', userId)
            .single()
        if (data) setProfile(data as Profile)
    }, [])

    /* Listen to auth state changes */
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null
            setUser(u)
            if (u) fetchProfile(u.id)
            setIsLoading(false)
        })

        // Subscribe to changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null
            setUser(u)
            if (u) fetchProfile(u.id)
            else setProfile(null)
        })

        return () => subscription.unsubscribe()
    }, [fetchProfile])

    /* Sign Up */
    const signUp = async (email: string, password: string, meta: { first_name: string; last_name: string; phone: string }) => {
        // 1. Local storage check
        if (localStorage.getItem('vibepick_registered') === 'true') {
            return { error: 'Este dispositivo ya ha sido utilizado para crear una cuenta. Por favor, inicia sesión.' }
        }

        try {
            // 2. Generate fingerprint
            const fp = await fpPromise.load()
            const result = await fp.get()
            const fingerprint = result.visitorId

            // 3. Check database using RPC
            const { data: hasRegistered, error: rpcError } = await supabase.rpc('check_device_fingerprint', { p_fingerprint: fingerprint })

            if (hasRegistered) {
                // Set local storage just in case it was cleared by the user
                localStorage.setItem('vibepick_registered', 'true')
                return { error: 'Este dispositivo ya ha sido utilizado para crear una cuenta. Por favor, inicia sesión.' }
            }

            // 4. Proceed with normal signup
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) return { error: error.message }
            if (!data.user) return { error: 'No user returned' }

            // Create profile row including the device fingerprint
            const { error: profileErr } = await supabase.from('users_profile').insert({
                id: data.user.id,
                first_name: meta.first_name,
                last_name: meta.last_name,
                phone: meta.phone,
                prompt_count: 0,
                is_pro: false,
                device_fingerprint: fingerprint,
            })
            if (profileErr) return { error: profileErr.message }

            // Mark device as registered
            localStorage.setItem('vibepick_registered', 'true')

            setProfile({
                first_name: meta.first_name,
                last_name: meta.last_name,
                phone: meta.phone,
                prompt_count: 0,
                is_pro: false,
            })
            return { error: null }
        } catch (err: any) {
            console.error('Error in signup process:', err)
            return { error: 'Error al verificar el dispositivo o crear la cuenta. Intenta de nuevo.' }
        }
    }

    /* Sign In */
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }
        return { error: null }
    }

    /* Sign Out */
    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    /* Increment prompt count and return new count */
    const incrementPromptCount = async (): Promise<number> => {
        if (!user || !profile) return 0
        const newCount = profile.prompt_count + 1
        await supabase
            .from('users_profile')
            .update({ prompt_count: newCount })
            .eq('id', user.id)
        setProfile({ ...profile, prompt_count: newCount })
        return newCount
    }

    return (
        <AuthContext.Provider value={{
            user, profile, isLoading, showAuth, setShowAuth,
            signUp, signIn, signOut, incrementPromptCount,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
