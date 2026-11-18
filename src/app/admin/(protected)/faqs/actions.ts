"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";
import { cleanText } from "@/lib/sanitize";
import type { FormState } from "@/lib/form-state";

const schema = z.object({
  question: z.string().min(5, "Enter the question.").max(300),
  answer: z.string().min(5, "Enter the answer.").max(3000),
  is_published: z.boolean(),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

function readForm(formData: FormData) {
  return {
    question: cleanText(formData.get("question"), 300),
    answer: cleanText(formData.get("answer"), 3000),
    is_published: formData.get("is_published") === "on",
    sort_order: formData.get("sort_order") ?? 0,
  };
}

function fail(error: z.ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const i of error.issues) fieldErrors[String(i.path[0])] ??= i.message;
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
}

function refresh() {
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  revalidatePath("/");
}

export async function createFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) return fail(parsed.error);

  const sb = await createClient();
  const { data, error } = await sb.from("faqs").insert(parsed.data).select("id").single();
  if (error || !data) return { ok: false, message: "Could not save the FAQ." };

  await logActivity({ adminId: session.userId, action: "create_faq", entityType: "faqs", entityId: data.id });
  refresh();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) return fail(parsed.error);

  const sb = await createClient();
  const { error } = await sb.from("faqs").update(parsed.data).eq("id", id);
  if (error) return { ok: false, message: "Could not save the FAQ." };

  await logActivity({ adminId: session.userId, action: "update_faq", entityType: "faqs", entityId: id });
  refresh();
  return { ok: true, message: "Saved." };
}

export async function deleteFaq(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { error } = await sb.from("faqs").delete().eq("id", id);
  if (error) return;
  await logActivity({ adminId: session.userId, action: "delete_faq", entityType: "faqs", entityId: id });
  refresh();
  redirect("/admin/faqs");
}
