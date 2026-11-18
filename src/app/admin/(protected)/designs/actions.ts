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
  title: z.string().min(2, "Enter a title.").max(120),
  description: z.string().max(4000).optional().default(""),
  service_id: z.string().optional().default(""),
  is_published: z.boolean(),
  is_featured: z.boolean(),
});

function readForm(formData: FormData) {
  return {
    title: cleanText(formData.get("title"), 120),
    description: cleanText(formData.get("description"), 4000),
    service_id: String(formData.get("service_id") ?? "").trim(),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    category_ids: formData.getAll("category_ids").map(String),
  };
}

function toPatch(data: z.infer<typeof schema>) {
  return {
    title: data.title,
    description: data.description || null,
    service_id: data.service_id || null,
    is_published: data.is_published,
    is_featured: data.is_featured,
  };
}

async function uniqueSlug(sb: Awaited<ReturnType<typeof createClient>>, base: string, excludeId?: string) {
  let slug = slugify(base) || "design";
  let n = 1;
  for (;;) {
    let q = sb.from("designs").select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

async function syncCategories(sb: Awaited<ReturnType<typeof createClient>>, designId: string, categoryIds: string[]) {
  await sb.from("design_category_links").delete().eq("design_id", designId);
  const rows = categoryIds.slice(0, 20).map((category_id) => ({ design_id: designId, category_id }));
  if (rows.length > 0) await sb.from("design_category_links").insert(rows);
}

export async function createDesign(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const raw = readForm(formData);
  const parsed = schema.safeParse(raw);
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
    const result = await uploadPublicImage(image, "designs");
    if ("error" in result) return { ok: false, message: result.error };
    cover_image_path = result.path;
  }

  const { data, error } = await sb
    .from("designs")
    .insert({ ...toPatch(parsed.data), slug, cover_image_path })
    .select("id")
    .single();
  if (error || !data) return { ok: false, message: "Could not save the design." };

  await syncCategories(sb, data.id, raw.category_ids);
  await logActivity({ adminId: session.userId, action: "create_design", entityType: "designs", entityId: data.id });
  revalidatePath("/designs");
  revalidatePath("/");
  redirect(`/admin/designs/${data.id}`);
}

export async function updateDesign(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const raw = readForm(formData);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const sb = await createClient();
  const { data: existing } = await sb.from("designs").select("title, slug, cover_image_path").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "This design no longer exists." };

  const patch: Record<string, unknown> = toPatch(parsed.data);
  if (parsed.data.title !== existing.title) patch.slug = await uniqueSlug(sb, parsed.data.title, id);

  const image = formData.get("cover_image") as File | null;
  const removeCover = formData.get("remove_cover_image") === "on";
  if (image && image.size > 0) {
    const result = await uploadPublicImage(image, "designs");
    if ("error" in result) return { ok: false, message: result.error };
    patch.cover_image_path = result.path;
    await deletePublicImage(existing.cover_image_path);
  } else if (removeCover) {
    patch.cover_image_path = null;
    await deletePublicImage(existing.cover_image_path);
  }

  const { error } = await sb.from("designs").update(patch).eq("id", id);
  if (error) return { ok: false, message: "Could not save the design." };

  await syncCategories(sb, id, raw.category_ids);
  await logActivity({ adminId: session.userId, action: "update_design", entityType: "designs", entityId: id });
  revalidatePath("/designs");
  revalidatePath(`/designs/${(patch.slug as string) ?? existing.slug}`);
  revalidatePath("/");
  return { ok: true, message: "Saved." };
}

export async function deleteDesign(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { data: design } = await sb.from("designs").select("cover_image_path").eq("id", id).maybeSingle();
  const { data: images } = await sb.from("design_images").select("storage_path").eq("design_id", id);
  const { error } = await sb.from("designs").delete().eq("id", id);
  if (error) return;
  await deletePublicImage(design?.cover_image_path);
  await Promise.all((images ?? []).map((i) => deletePublicImage(i.storage_path)));
  await logActivity({ adminId: session.userId, action: "delete_design", entityType: "designs", entityId: id });
  revalidatePath("/designs");
  revalidatePath("/");
  redirect("/admin/designs");
}

export async function addDesignImage(designId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { ok: false, message: "Choose a photo to upload." };

  const result = await uploadPublicImage(file, `designs/${designId}`);
  if ("error" in result) return { ok: false, message: result.error };

  const sb = await createClient();
  const { count } = await sb.from("design_images").select("*", { count: "exact", head: true }).eq("design_id", designId);
  const { error } = await sb
    .from("design_images")
    .insert({ design_id: designId, storage_path: result.path, sort_order: count ?? 0 });
  if (error) {
    await deletePublicImage(result.path);
    return { ok: false, message: "Could not save the photo." };
  }

  await logActivity({ adminId: session.userId, action: "add_design_image", entityType: "designs", entityId: designId });
  revalidatePath(`/admin/designs/${designId}`);
  revalidatePath("/designs");
  return { ok: true, message: "Photo added." };
}

export async function deleteDesignImage(designId: string, imageId: string) {
  await requireAdmin();
  const sb = await createClient();
  const { data } = await sb.from("design_images").select("storage_path").eq("id", imageId).maybeSingle();
  const { error } = await sb.from("design_images").delete().eq("id", imageId);
  if (error) return;
  await deletePublicImage(data?.storage_path);
  revalidatePath(`/admin/designs/${designId}`);
  revalidatePath("/designs");
}
