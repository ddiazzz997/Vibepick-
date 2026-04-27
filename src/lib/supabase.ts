import { createClient } from '@supabase/supabase-js'

// Anon key is public by design (VITE_ prefix = bundled into client JS).
// Hardcoded fallbacks ensure the app boots even when Vercel env vars are not set.
const supabaseUrl     = (import.meta.env.VITE_SUPABASE_URL      as string | undefined)
    ?? 'https://ttchpzlsjkazuqhpmazv.supabase.co'
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
    ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2hwemxzamthenVxaHBtYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODkwMjAsImV4cCI6MjA4ODA2NTAyMH0.uxpuIjFkphgnD4bmK6F88c7hjsH_plzxVFTa12VjEZU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession:     true,
        autoRefreshToken:   true,
        detectSessionInUrl: false,
    },
})
