/**
 * Runs in the browser. Shrinks a phone photo before upload so that the form is quick,
 * uses little mobile data, and stays under the hosting size limit.
 * Throws if the browser cannot read the file.
 */
const STEPS: Array<{ edge: number; quality: number }> = [
  { edge: 1600, quality: 0.8 },
  { edge: 1280, quality: 0.7 },
  { edge: 1024, quality: 0.6 },
];
const TARGET_BYTES = 1_200_000;

export async function compressImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Unsupported photo type");

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    let blob: Blob | null = null;
    for (const step of STEPS) {
      const scale = Math.min(1, step.edge / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas");
      ctx.fillStyle = "#ffffff"; // PNG transparency becomes white instead of black
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", step.quality));
      if (blob && blob.size <= TARGET_BYTES) break;
    }
    if (!blob) throw new Error("Could not compress");
    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}
