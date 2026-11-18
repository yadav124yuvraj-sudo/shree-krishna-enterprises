import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/** Anonymous server client for public pages. No cookies, so pages can be cached. */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Helper to get public URL for files in public-media bucket */
export function getPublicMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const env = getSupabaseEnv();
  if (!env) return null;
  return `${env.url}/storage/v1/object/public/public-media/${path.replace(/^\//, "")}`;
}

