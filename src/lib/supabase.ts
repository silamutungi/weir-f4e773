import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const supabaseSchema = (import.meta.env.VITE_SUPABASE_SCHEMA as string) || 'public'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: supabaseSchema },
})

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
