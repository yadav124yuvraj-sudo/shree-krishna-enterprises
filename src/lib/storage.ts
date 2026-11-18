import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Public URL of a photo in the "public-media" bucket.
 * `path` is the path saved in the database (for example "projects/living-room/1.jpg").
 */
export function publicMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const env = getSupabaseEnv();
  if (!env) return null;
  const clean = path
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `${env.url}/storage/v1/object/public/public-media/${clean}`;
}
