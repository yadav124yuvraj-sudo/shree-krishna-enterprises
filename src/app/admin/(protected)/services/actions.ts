"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";
import { cleanText } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { deletePublicImage, uploadPublicImage } from "@/lib/upload";

export type FormState = { ok?: boolean; message?: string; fieldErrors?: Record<string, string> } | null;

const schema = z.object({
  title: z.string().min(2, "Enter a title.").max(100),
  short_description: z.string().max(200).optional().default(""),
  description: z.string().max(4000).optional().default(""),
  is_published: z.boolean(),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

function readForm(formData: FormData) {
  return {
    title: cleanText(formData.get("title"), 100),
    short_description: cleanText(formData.get("short_description"), 200),
    description: cleanText(formData.get("description"), 4000),
    is_published: formData.get("is_published") === "on",
    sort_order: formData.get("sort_order") ?? 0,
  };
}

async function uniqueSlug(sb: Awaited<ReturnType<typeof createClient>>, base: string, excludeId?: string) {
  let slug = slugify(base) || "service";
  let n = 1;
  for (;;) {
    let q = sb.from("services").select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function createService(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const sb = await createClient();
  const slug = await uniqueSlug(sb, parsed.data.title);

  let cover_image_path: string | null = null;
  const image = formData.get("cover_image") as File | null;
  if (image && image.size > 0) {
    const result = await uploadPublicImage(image, "services");
    if ("error" in result) return { ok: false, message: result.error };
    cover_image_path = result.path;
  }

  const { data, error } = await sb
    .from("services")
    .insert({ ...parsed.data, slug, cover_image_path })
    .select("id")
    .single();
  if (error || !data) return { ok: false, message: "Could not save the service." };

  await logActivity({ adminId: session.userId, action: "create_service", entityType: "services", entityId: data.id });
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const sb = await createClient();
  const { data: existing } = await sb.from("services").select("title, cover_image_path").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "This service no longer exists." };

  const patch: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.title !== existing.title) {
    patch.slug = await uniqueSlug(sb, parsed.data.title, id);
  }

  const image = formData.get("cover_image") as File | null;
  const removeCover = formData.get("remove_cover_image") === "on";
  if (image && image.size > 0) {
    const result = await uploadPublicImage(image, "services");
    if ("error" in result) return { ok: false, message: result.error };
    patch.cover_image_path = result.path;
    await deletePublicImage(existing.cover_image_path);
  } else if (removeCover) {
    patch.cover_image_path = null;
    await deletePublicImage(existing.cover_image_path);
  }

  const { error } = await sb.from("services").update(patch).eq("id", id);
  if (error) return { ok: false, message: "Could not save the service." };

  await logActivity({ adminId: session.userId, action: "update_service", entityType: "services", entityId: id });
  revalidatePath("/services");
  revalidatePath(`/services/${(patch.slug as string) ?? existing.title}`);
  revalidatePath("/");
  return { ok: true, message: "Saved." };
}

export async function deleteService(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { data } = await sb.from("services").select("cover_image_path").eq("id", id).maybeSingle();
  const { error } = await sb.from("services").delete().eq("id", id);
  if (error) return;
  if (data?.cover_image_path) await deletePublicImage(data.cover_image_path);
  await logActivity({ adminId: session.userId, action: "delete_service", entityType: "services", entityId: id });
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}
