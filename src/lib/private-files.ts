import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Customer photos (enquiries, applications, reviews) live in the PRIVATE bucket "customer-uploads".
 * These helpers run as the logged-in admin; the storage policy allows admins only.
 */
const BUCKET = "customer-uploads";

/** Returns path -> temporary URL (valid for one hour). Missing files are simply left out. */
export async function signedUrlsFor(paths: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (unique.length === 0) return result;
  try {
    const sb = await createClient();
    const { data } = await sb.storage.from(BUCKET).createSignedUrls(unique, 60 * 60);
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) result.set(item.path, item.signedUrl);
    }
  } catch {
    // Photos are optional context. The page still works without them.
  }
  return result;
}

/** Best effort delete. Never throws. */
export async function removePrivateFiles(paths: string[]) {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (unique.length === 0) return;
  try {
    const sb = await createClient();
    await sb.storage.from(BUCKET).remove(unique);
  } catch {
    // best effort
  }
}
