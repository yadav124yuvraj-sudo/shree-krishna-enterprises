import "server-only";
import { createServiceClient } from "@/lib/supabase/admin";

/**
 * Counts one hit for `key` and returns true while the visitor is still under the limit.
 * Uses the database function check_rate_limit (service role only).
 * If the limiter itself breaks, it lets the request through so real customers are never locked out.
 */
export async function checkRateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb.rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) return true;
    return data === true;
  } catch {
    return true;
  }
}
