import "server-only";
import { createServiceClient } from "@/lib/supabase/admin";
import { MAX_PHOTOS } from "@/lib/enquiry-options";

/** Customer photos go to the PRIVATE bucket "customer-uploads". Only admins can open them. */
const BUCKET = "customer-uploads";
const MAX_BYTES = 5 * 1024 * 1024;

type Detected = { ext: string; type: string };
export type ValidPhoto = { bytes: Uint8Array; ext: string; type: string };

const ascii = (b: Uint8Array, from: number, to: number) => String.fromCharCode(...b.slice(from, to));

/** Looks at the first bytes of the file. The browser-supplied file type is not trusted. */
function detect(b: Uint8Array): Detected | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (b[0] === 0x89 && ascii(b, 1, 4) === "PNG") return { ext: "png", type: "image/png" };
  if (ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  if (ascii(b, 4, 8) === "ftyp" && /^(heic|heix|hevc|heim|mif1|heif)/.test(ascii(b, 8, 12))) {
    return { ext: "heic", type: "image/heic" };
  }
  return null;
}

export function filesFrom(formData: FormData, name = "photos"): File[] {
  return formData.getAll(name).filter((f): f is File => f instanceof File && f.size > 0);
}

/** Checks count, size and real file type. Nothing is stored yet. */
export async function readPhotos(files: File[]): Promise<{ photos: ValidPhoto[] } | { error: string }> {
  if (files.length > MAX_PHOTOS) return { error: `You can add up to ${MAX_PHOTOS} photos.` };
  const photos: ValidPhoto[] = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) return { error: "Each photo must be smaller than 5 MB." };
    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = detect(bytes);
    if (!kind) return { error: "Use JPG, PNG or WEBP photos only." };
    photos.push({ bytes, ext: kind.ext, type: kind.type });
  }
  return { photos };
}

/** Saves photos under `folder` and returns the paths that were saved. A failed photo is skipped. */
export async function storePhotos(folder: string, photos: ValidPhoto[]): Promise<string[]> {
  const saved: string[] = [];
  if (photos.length === 0) return saved;
  const sb = createServiceClient();
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "-");
  for (const p of photos) {
    const path = `${safeFolder}/${crypto.randomUUID()}.${p.ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, p.bytes, { contentType: p.type, upsert: false });
    if (!error) saved.push(path);
  }
  return saved;
}
