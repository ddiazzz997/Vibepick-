import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ttchpzlsjkazuqhpmazv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2hwemxzamthenVxaHBtYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODkwMjAsImV4cCI6MjA4ODA2NTAyMH0.uxpuIjFkphgnD4bmK6F88c7hjsH_plzxVFTa12VjEZU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
