/** Reads Supabase settings. Accepts the legacy "anon" key or the newer "publishable" key. */
export function getSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();
  if (!rawUrl || !anonKey) return null;

  // Keep only https://xxxx.supabase.co and drop any extra path like /rest/v1/
  let url: string;
  try {
    url = new URL(rawUrl).origin;
  } catch {
    return null;
  }
  return { url, anonKey };
}

export const isSupabaseConfigured = () => getSupabaseEnv() !== null;
