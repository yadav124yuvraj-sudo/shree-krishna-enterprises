"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";
import { cleanText } from "@/lib/sanitize";

export type SettingsState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
} | null;

const emptyToNull = (v: string) => (v === "" ? null : v);

const schema = z.object({
  business_name: z.string().min(2, "Enter the business name.").max(100),
  tagline: z.string().min(2, "Enter a tagline.").max(150),
  phone: z
    .string()
    .max(20)
    .regex(/^([+0-9][0-9 -]{5,19})?$/, "Use digits only, for example +91 98765 43210.")
    .transform(emptyToNull),
  whatsapp_number: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || /^[0-9]{10,15}$/.test(v), "Enter country code and number, 10 to 15 digits.")
    .transform(emptyToNull),
  email: z.string().max(254).email("Enter a valid email address.").or(z.literal("")).transform(emptyToNull),
  address: z.string().max(500).transform(emptyToNull),
  working_hours: z.string().max(200).transform(emptyToNull),
  map_embed_url: z
    .string()
    .max(1000)
    .refine((v) => v === "" || v.startsWith("https://www.google.com/maps/embed"), "Paste the Google Maps embed link (it starts with https://www.google.com/maps/embed).")
    .transform(emptyToNull),
  about_intro: z.string().max(1000).transform(emptyToNull),
  about_story: z.string().max(3000).transform(emptyToNull),
  about_workmanship: z.string().max(2000).transform(emptyToNull),
  about_team: z.string().max(2000).transform(emptyToNull),
  about_details: z.string().max(2000).transform(emptyToNull),
});

export async function saveSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await requireAdmin();

  const raw = {
    business_name: cleanText(formData.get("business_name"), 100),
    tagline: cleanText(formData.get("tagline"), 150),
    phone: cleanText(formData.get("phone"), 20),
    whatsapp_number: cleanText(formData.get("whatsapp_number"), 30),
    email: cleanText(formData.get("email"), 254),
    address: cleanText(formData.get("address"), 500),
    working_hours: cleanText(formData.get("working_hours"), 200),
    map_embed_url: String(formData.get("map_embed_url") ?? "").trim(),
    about_intro: cleanText(formData.get("about_intro"), 1000),
    about_story: cleanText(formData.get("about_story"), 3000),
    about_workmanship: cleanText(formData.get("about_workmanship"), 2000),
    about_team: cleanText(formData.get("about_team"), 2000),
    about_details: cleanText(formData.get("about_details"), 2000),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("business_settings").update(parsed.data).eq("id", true);
  if (error) {
    return { ok: false, message: "Could not save. Run the ALTER TABLE SQL in Supabase first, then try again." };
  }

  await logActivity({
    adminId: session.userId,
    action: "update_business_settings",
    entityType: "business_settings",
    details: { fields: Object.keys(parsed.data) },
  });

  revalidatePath("/", "layout");
  revalidatePath("/about");
  return { ok: true, message: "Saved. The website now shows these details." };
}
