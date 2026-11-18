import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminSession = {
  userId: string;
  email: string;
  fullName: string | null;
  role: "admin" | "super_admin";
};

/**
 * Verifies on the SERVER that the current user is an active admin.
 * Uses auth.getUser() (checked with Supabase), not just the cookie contents.
 * The database enforces the same rule again through RLS.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active, full_name")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) return null;
  if (profile.role !== "admin" && profile.role !== "super_admin") return null;

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    fullName: profile.full_name,
    role: profile.role,
  };
}

/** Call at the top of every admin page and every admin server action. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
