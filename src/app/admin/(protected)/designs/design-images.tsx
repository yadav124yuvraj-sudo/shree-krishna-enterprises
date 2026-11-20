"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { compressImage } from "@/lib/compress-image";
import type { FormState } from "./actions";

const MAX_DIRECT_BYTES = 3.5 * 1024 * 1024; // 3.5 MB

function AddPhotoButton({ compressing }: { compressing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || compressing}>
      {compressing ? "Preparing..." : pending ? "Uploading" : "Add photo"}
    </Button>
  );
}

export function DesignImages({
  images,
  addAction,
  deleteAction,
}: {
  images: { id: string; url: string }[];
  addAction: (prev: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (imageId: string) => Promise<void>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(addAction, null);
  const [compressing, setCompressing] = useState(false);
  const [sizeNote, setSizeNote] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    setSizeNote(null);
    if (!file || file.size <= MAX_DIRECT_BYTES) return;

    setCompressing(true);
    try {
      const origMB = (file.size / (1024 * 1024)).toFixed(1);
      const compressed = await compressImage(file);
      const newMB = (compressed.size / (1024 * 1024)).toFixed(2);
      const dt = new DataTransfer();
      dt.items.add(compressed);
      input.files = dt.files;
      setSizeNote(`Large photo optimized (${origMB} MB → ${newMB} MB) for smooth upload.`);
    } catch {
      setSizeNote("Could not auto-compress this file. Please choose an image under 4 MB.");
    } finally {
      setCompressing(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl text-charcoal">More photos</h2>
      <p className="mt-1 text-stone">Shown on the design&apos;s detail page, along with the cover photo.</p>

      <form action={formAction} className="mt-5 flex flex-wrap items-end gap-3">
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          required
          className="block text-sm text-stone file:mr-4 file:h-11 file:rounded-sm file:border-0 file:bg-charcoal file:px-4 file:text-warm-white"
        />
        <AddPhotoButton compressing={compressing} />
      </form>
      {compressing ? <p className="mt-2 text-xs text-stone">Optimizing large photo...</p> : null}
      {sizeNote ? <p className="mt-2 text-xs text-green-900">{sizeNote}</p> : null}
      {state?.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? "mt-3 text-green-900" : "mt-3 text-red-800"}>
          {state.message}
        </p>
      ) : null}

      {images.length === 0 ? (
        <p className="mt-6 text-stone">No extra photos yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <li key={img.id} className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-beige">
                <Image src={img.url} alt="" fill sizes="200px" className="object-cover" />
              </div>
              <form action={deleteAction.bind(null, img.id)}>
                <DeleteButton confirm="Remove this photo?" label="Remove" />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}