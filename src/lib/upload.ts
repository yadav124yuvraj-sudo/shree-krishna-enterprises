import "server-only";
import { createServiceClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadResult = { path: string } | { error: string };

/**
 * Validates and uploads one admin photo to the public "public-media" bucket.
 * `folder` groups files, e.g. "projects/<project-id>".
 */
export async function uploadPublicImage(file: File, folder: string): Promise<UploadResult> {
  if (!file || file.size === 0) return { error: "Choose an image to upload." };
  if (!ALLOWED_TYPES.has(file.type)) return { error: "Use a JPG, PNG, WEBP or AVIF image." };
  if (file.size > MAX_BYTES) return { error: "Image must be smaller than 5 MB." };

  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "-");
  const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;

  const supabase = createServiceClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("public-media")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) return { error: "Upload failed. Try again." };
  return { path };
}

/** Deletes a photo from "public-media". Never throws: a missing file is not a user-facing error. */
export async function deletePublicImage(path: string | null | undefined) {
  if (!path) return;
  try {
    await createServiceClient().storage.from("public-media").remove([path]);
  } catch {
    // best effort
  }
}
