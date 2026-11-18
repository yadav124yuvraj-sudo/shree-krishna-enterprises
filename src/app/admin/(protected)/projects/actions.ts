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
  location: z.string().max(120).optional().default(""),
  description: z.string().max(4000).optional().default(""),
  completed_on: z.string().optional().default(""),
  video_url: z
    .string()
    .max(300)
    .refine((v) => v === "" || /^https:\/\//.test(v), "Video link must start with https://")
    .optional()
    .default(""),
  service_id: z.string().optional().default(""),
  is_published: z.boolean(),
  is_featured: z.boolean(),
});

function readForm(formData: FormData) {
  return {
    title: cleanText(formData.get("title"), 120),
    location: cleanText(formData.get("location"), 120),
    description: cleanText(formData.get("description"), 4000),
    completed_on: String(formData.get("completed_on") ?? "").trim(),
    video_url: String(formData.get("video_url") ?? "").trim(),
    service_id: String(formData.get("service_id") ?? "").trim(),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

function toPatch(data: z.infer<typeof schema>) {
  return {
    title: data.title,
    location: data.location || null,
    description: data.description || null,
    completed_on: data.completed_on || null,
    video_url: data.video_url || null,
    service_id: data.service_id || null,
    is_published: data.is_published,
    is_featured: data.is_featured,
  };
}

async function uniqueSlug(sb: Awaited<ReturnType<typeof createClient>>, base: string, excludeId?: string) {
  let slug = slugify(base) || "project";
  let n = 1;
  for (;;) {
    let q = sb.from("projects").select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }
  const sb = await createClient();
  const slug = await uniqueSlug(sb, parsed.data.title);
  const { data, error } = await sb
    .from("projects")
    .insert({ ...toPatch(parsed.data), slug })
    .select("id")
    .single();
  if (error || !data) return { ok: false, message: "Could not save the project." };

  await logActivity({ adminId: session.userId, action: "create_project", entityType: "projects", entityId: data.id });
  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }
  const sb = await createClient();
  const { data: existing } = await sb.from("projects").select("title, slug").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "This project no longer exists." };

  const patch: Record<string, unknown> = toPatch(parsed.data);
  if (parsed.data.title !== existing.title) patch.slug = await uniqueSlug(sb, parsed.data.title, id);

  const { error } = await sb.from("projects").update(patch).eq("id", id);
  if (error) return { ok: false, message: "Could not save the project." };

  await logActivity({ adminId: session.userId, action: "update_project", entityType: "projects", entityId: id });
  revalidatePath("/projects");
  revalidatePath(`/projects/${(patch.slug as string) ?? existing.slug}`);
  revalidatePath("/");
  return { ok: true, message: "Saved." };
}

export async function deleteProject(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { data: images } = await sb.from("project_images").select("storage_path").eq("project_id", id);
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) return;
  await Promise.all((images ?? []).map((i) => deletePublicImage(i.storage_path)));
  await logActivity({ adminId: session.userId, action: "delete_project", entityType: "projects", entityId: id });
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

const KINDS = ["gallery", "before", "after"] as const;

export async function addProjectImage(projectId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const file = formData.get("image") as File | null;
  const kind = String(formData.get("kind") ?? "gallery");
  if (!file || file.size === 0) return { ok: false, message: "Choose a photo to upload." };
  if (!KINDS.includes(kind as (typeof KINDS)[number])) return { ok: false, message: "Invalid photo type." };

  const result = await uploadPublicImage(file, `projects/${projectId}`);
  if ("error" in result) return { ok: false, message: result.error };

  const sb = await createClient();
  const { count } = await sb
    .from("project_images")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);
  const { error } = await sb
    .from("project_images")
    .insert({ project_id: projectId, storage_path: result.path, kind, sort_order: count ?? 0 });
  if (error) {
    await deletePublicImage(result.path);
    return { ok: false, message: "Could not save the photo." };
  }

  await logActivity({ adminId: session.userId, action: "add_project_image", entityType: "projects", entityId: projectId });
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  return { ok: true, message: "Photo added." };
}

export async function deleteProjectImage(projectId: string, imageId: string) {
  await requireAdmin();
  const sb = await createClient();
  const { data } = await sb.from("project_images").select("storage_path").eq("id", imageId).maybeSingle();
  const { error } = await sb.from("project_images").delete().eq("id", imageId);
  if (error) return;
  await deletePublicImage(data?.storage_path);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
}
