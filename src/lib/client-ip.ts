import "server-only";
import { headers } from "next/headers";

/** Visitor IP as set by the hosting platform (Vercel). Null when it cannot be read. */
export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = (forwarded?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim();
  return ip && ip.length <= 64 ? ip : null;
}
