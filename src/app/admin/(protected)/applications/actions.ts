"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";
import { cleanText } from "@/lib/sanitize";
import { APPLICATION_STATUSES } from "@/lib/admin-status";
import { removePrivateFiles } from "@/lib/private-files";
import type { FormState } from "@/lib/form-state";

const schema = z.object({
  status: z.enum(APPLICATION_STATUSES, "Choose a status."),
  admin_notes: z.string().max(4000),
});

export async function updateApplication(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse({
    status: formData.get("status"),
    admin_notes: cleanText(formData.get("admin_notes"), 4000),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const sb = await createClient();
  const { error } = await sb
    .from("worker_applications")
    .update({ status: parsed.data.status, admin_notes: parsed.data.admin_notes || null })
    .eq("id", id);
  if (error) return { ok: false, message: "Could not save. Try again." };

  await logActivity({
    adminId: session.userId,
    action: "update_application",
    entityType: "worker_applications",
    entityId: id,
    details: { status: parsed.data.status },
  });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin");
  return { ok: true, message: "Saved." };
}

export async function deleteApplication(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { data: images } = await sb
    .from("worker_application_images")
    .select("storage_path")
    .eq("application_id", id);
  const { error } = await sb.from("worker_applications").delete().eq("id", id);
  if (error) return;
  await removePrivateFiles((images ?? []).map((i: { storage_path: string }) => i.storage_path));
  await logActivity({ adminId: session.userId, action: "delete_application", entityType: "worker_applications", entityId: id });
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  redirect("/admin/applications");
}
