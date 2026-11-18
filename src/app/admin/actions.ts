"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import { getAdminSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export type LoginState = { error?: string } | null;

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(200),
});

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not set up yet. Add the Supabase keys to .env.local and restart." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Extra details are shown only while developing on your own computer, never on the live site.
  const dev = process.env.NODE_ENV !== "production";
  let host = "";
  try {
    host = new URL(getSupabaseEnv()?.url ?? "").hostname;
  } catch {}

  if (error) {
    const detail = dev ? ` [${error.code ?? error.name}: ${error.message}. Connected to: ${host}]` : "";

    if (error.name === "AuthRetryableFetchError") {
      return { error: "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your internet connection." + detail };
    }
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "This email is not confirmed yet. In Supabase open Authentication, Users and confirm it, or delete the user and create it again with Auto Confirm User ticked.",
      };
    }
    if (error.code === "invalid_api_key" || /api key/i.test(error.message)) {
      return { error: "The Supabase key in .env.local is wrong. Use the publishable (anon) key, not the secret key." + detail };
    }
    // Wrong email and wrong password give the same message, so accounts cannot be guessed.
    if (error.code === "invalid_credentials") {
      return { error: "Email or password is incorrect." + detail };
    }
    return { error: "Sign in failed." + detail };
  }

  const session = await getAdminSession();
  if (!session) {
    let detail = "";
    if (dev) {
      const { data: u } = await supabase.auth.getUser();
      const { data: p, error: pe } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", u.user?.id ?? "00000000-0000-0000-0000-000000000000")
        .maybeSingle();
      const profileText = p ? `role=${p.role}, active=${p.is_active}` : "NOT FOUND";
      detail =
        ` [logged in as: ${u.user?.email ?? "nobody"}; profile: ${profileText}` +
        `${pe ? `; db error: ${pe.message}` : ""}; project: ${host}]`;
    }
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." + detail };
  }

  await logActivity({ adminId: session.userId, action: "login" });
  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}