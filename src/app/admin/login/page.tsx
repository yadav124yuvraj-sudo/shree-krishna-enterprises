import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const configured = isSupabaseConfigured();

  return (
    <div className="flex flex-1 items-center justify-center bg-beige/60 px-5 py-16">
      <div className="w-full max-w-sm rounded-sm border border-line bg-warm-white p-8">
        <h1 className="font-serif text-3xl text-charcoal">Admin sign in</h1>
        <p className="mt-2 text-stone">Shree Krishna Enterprises dashboard.</p>
        {!configured ? (
          <p className="mt-6 rounded-sm border border-line bg-beige px-3 py-3 text-sm text-charcoal">
            Supabase is not connected yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then restart the server.
          </p>
        ) : null}
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
