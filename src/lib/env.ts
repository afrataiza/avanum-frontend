const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const env = {
  supabaseUrl,
  supabasePublishableKey,
} as const

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabasePublishableKey)
}
