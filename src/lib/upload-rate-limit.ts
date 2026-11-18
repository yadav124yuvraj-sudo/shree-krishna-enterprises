import { createHash } from "crypto";
import { cookies, headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/admin";

const MAX_UPLOADS_PER_24H = 2;
const COOKIE_NAME = "ske_upload_tracker";

function hashIdentifier(raw: string): string {
  return createHash("sha256").update(`ske-salt:${raw}`).digest("hex").slice(0, 32);
}

/**
 * Checks if the current user/IP has already uploaded 2 images in the last 24 hours.
 * Uses both client IP (via Supabase enquiries/reviews/custom_designs check) and signed cookie fallback.
 */
export async function checkAndRecordUploadLimit(requestedCount: number): Promise<{
  allowed: boolean;
  remaining: number;
  message?: string;
}> {
  if (requestedCount <= 0) {
    return { allowed: true, remaining: MAX_UPLOADS_PER_24H };
  }

  if (requestedCount > MAX_UPLOADS_PER_24H) {
    return {
      allowed: false,
      remaining: 0,
      message: `Security limit: You can only upload up to ${MAX_UPLOADS_PER_24H} images in 24 hours.`,
    };
  }

  const hdrs = await headers();
  const forwardedFor = hdrs.get("x-forwarded-for") || hdrs.get("x-real-ip") || "unknown-ip";
  const clientIp = forwardedFor.split(",")[0].trim();
  const ipHash = hashIdentifier(clientIp);

  const cookieStore = await cookies();
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;

  // 1. Check cookie-based timestamps from last 24h
  let recentTimestamps: number[] = [];
  try {
    const rawCookie = cookieStore.get(COOKIE_NAME)?.value;
    if (rawCookie) {
      const parsed = JSON.parse(rawCookie);
      if (Array.isArray(parsed)) {
        recentTimestamps = parsed.filter(
          (ts): ts is number => typeof ts === "number" && now - ts < windowMs,
        );
      }
    }
  } catch {
    recentTimestamps = [];
  }

  // 2. Also check Supabase enquiries table (ref_code prefix UPL-<ipHash>) for cross-browser / incognito protection
  let dbCount = 0;
  try {
    const sb = createServiceClient();
    const sinceIso = new Date(now - windowMs).toISOString();
    const { count } = await sb
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .like("ref_code", `UPL-${ipHash.slice(0, 8).toUpperCase()}-%`)
      .gte("created_at", sinceIso);

    if (typeof count === "number") {
      dbCount = count;
    }
  } catch {
    // Continue with cookie check if DB query unavailable
  }

  const usedCount = Math.max(recentTimestamps.length, dbCount);
  const remaining = Math.max(0, MAX_UPLOADS_PER_24H - usedCount);

  if (usedCount + requestedCount > MAX_UPLOADS_PER_24H) {
    return {
      allowed: false,
      remaining,
      message:
        remaining === 0
          ? "Daily limit reached: You can only upload 2 images within 24 hours. Please try again tomorrow."
          : `You only have ${remaining} image upload remaining for today (limit: 2 images per 24 hours).`,
    };
  }

  // Record the new uploads in cookie
  const updatedTimestamps = [...recentTimestamps, ...Array(requestedCount).fill(now)];
  cookieStore.set(COOKIE_NAME, JSON.stringify(updatedTimestamps), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  return {
    allowed: true,
    remaining: Math.max(0, MAX_UPLOADS_PER_24H - (usedCount + requestedCount)),
  };
}

export async function getUploaderTag(): Promise<string> {
  const hdrs = await headers();
  const forwardedFor = hdrs.get("x-forwarded-for") || hdrs.get("x-real-ip") || "unknown-ip";
  const clientIp = forwardedFor.split(",")[0].trim();
  const ipHash = hashIdentifier(clientIp);
  return `UPL-${ipHash.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}
