"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";
import { cleanText } from "@/lib/sanitize";
import type { FormState } from "@/lib/form-state";

const schema = z.object({
  name: z.string().min(2, "Enter the area name.").max(80),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_active: z.boolean(),
});

function readForm(formData: FormData) {
  return {
    name: cleanText(formData.get("name"), 80),
    sort_order: formData.get("sort_order") ?? 0,
    is_active: formData.get("is_active") === "on",
  };
}

function refresh() {
  revalidatePath("/admin/service-areas");
  revalidatePath("/");
  revalidatePath("/contact");
}

export async function createServiceArea(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const sb = await createClient();
  const { data, error } = await sb.from("service_areas").insert(parsed.data).select("id").single();
  if (error) {
    return {
      ok: false,
      message: error.code === "23505" ? "This area is already in the list." : "Could not add the area.",
    };
  }

  await logActivity({ adminId: session.userId, action: "create_service_area", entityType: "service_areas", entityId: data?.id });
  refresh();
  return { ok: true, message: "Area added." };
}

export async function updateServiceArea(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const sb = await createClient();
  const { error } = await sb.from("service_areas").update(parsed.data).eq("id", id);
  if (error) {
    return {
      ok: false,
      message: error.code === "23505" ? "This area is already in the list." : "Could not save.",
    };
  }

  await logActivity({ adminId: session.userId, action: "update_service_area", entityType: "service_areas", entityId: id });
  refresh();
  return { ok: true, message: "Saved." };
}

export async function deleteServiceArea(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { error } = await sb.from("service_areas").delete().eq("id", id);
  if (error) return;
  await logActivity({ adminId: session.userId, action: "delete_service_area", entityType: "service_areas", entityId: id });
  refresh();
}
