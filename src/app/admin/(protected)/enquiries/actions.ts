"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";
import { cleanText } from "@/lib/sanitize";
import { ENQUIRY_STATUSES } from "@/lib/admin-status";
import { removePrivateFiles } from "@/lib/private-files";
import type { FormState } from "@/lib/form-state";

const schema = z.object({
  status: z.enum(ENQUIRY_STATUSES, "Choose a status."),
  admin_notes: z.string().max(4000),
  follow_up_on: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")]),
});

export async function updateEnquiry(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse({
    status: formData.get("status"),
    admin_notes: cleanText(formData.get("admin_notes"), 4000),
    follow_up_on: cleanText(formData.get("follow_up_on"), 10),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const sb = await createClient();
  const { data: existing } = await sb.from("enquiries").select("status").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "This enquiry no longer exists." };

  const patch: Record<string, unknown> = {
    admin_notes: parsed.data.admin_notes || null,
    follow_up_on: parsed.data.follow_up_on || null,
  };
  // Only touch "status" when it really changed, so the status history stays clean.
  if (parsed.data.status !== existing.status) patch.status = parsed.data.status;

  const { error } = await sb.from("enquiries").update(patch).eq("id", id);
  if (error) return { ok: false, message: "Could not save. Try again." };

  await logActivity({
    adminId: session.userId,
    action: "update_enquiry",
    entityType: "enquiries",
    entityId: id,
    details: patch.status ? { status: parsed.data.status } : undefined,
  });
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin");
  return { ok: true, message: "Saved." };
}

export async function deleteEnquiry(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { data: images } = await sb.from("enquiry_images").select("storage_path").eq("enquiry_id", id);
  const { error } = await sb.from("enquiries").delete().eq("id", id);
  if (error) return;
  await removePrivateFiles((images ?? []).map((i: { storage_path: string }) => i.storage_path));
  await logActivity({ adminId: session.userId, action: "delete_enquiry", entityType: "enquiries", entityId: id });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect("/admin/enquiries");
}
