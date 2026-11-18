import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm, type SettingsValues } from "./settings-form";

export const metadata = { title: "Business settings" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data } = await sb.from("business_settings").select("*").eq("id", true).maybeSingle();

  const values: SettingsValues = {
    business_name: data?.business_name ?? "Shree Krishna Enterprises",
    tagline: data?.tagline ?? "Transforming Spaces with Beautiful POP & PVC Designs",
    phone: data?.phone ?? "",
    whatsapp_number: data?.whatsapp_number ?? "",
    email: data?.email ?? "",
    address: data?.address ?? "",
    working_hours: data?.working_hours ?? "",
    map_embed_url: data?.map_embed_url ?? "",
    about_intro: data?.about_intro ?? "",
    about_story: data?.about_story ?? "",
    about_workmanship: data?.about_workmanship ?? "",
    about_team: data?.about_team ?? "",
    about_details: data?.about_details ?? "",
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl text-charcoal">Business settings</h1>
      <p className="mt-2 text-stone">
        Update your contact details, working hours, Google Maps link, and About Us page text here.
      </p>
      <div className="mt-8">
        <SettingsForm values={values} />
      </div>
    </div>
  );
}
