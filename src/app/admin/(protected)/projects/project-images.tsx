"use client";

import { useActionState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DeleteButton } from "@/components/admin/delete-button";
import type { FormState } from "./actions";

type Img = { id: string; url: string; kind: string; alt_text: string | null };

function AddPhotoButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading" : "Add photo"}
    </Button>
  );
}

export function ProjectImages({
  images,
  addAction,
  deleteAction,
}: {
  images: Img[];
  addAction: (prev: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (imageId: string) => Promise<void>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(addAction, null);

  return (
    <div>
      <h2 className="text-2xl text-charcoal">Photos</h2>
      <p className="mt-1 text-stone">
        &quot;Gallery&quot; photos show in the project&apos;s photo grid. Add a matching &quot;Before&quot; and &quot;After&quot; pair to show the
        before/after slider.
      </p>

      <form action={formAction} className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="kind" className="block text-sm font-medium text-charcoal">Type</label>
          <Select id="kind" name="kind" className="mt-1.5 w-40" defaultValue="gallery">
            <option value="gallery">Gallery</option>
            <option value="before">Before</option>
            <option value="after">After</option>
          </Select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-charcoal">Photo</label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className="mt-1.5 block text-sm text-stone file:mr-4 file:h-11 file:rounded-sm file:border-0 file:bg-charcoal file:px-4 file:text-warm-white"
          />
        </div>
        <AddPhotoButton />
      </form>
      {state?.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? "mt-3 text-green-900" : "mt-3 text-red-800"}>
          {state.message}
        </p>
      ) : null}

      {images.length === 0 ? (
        <p className="mt-6 text-stone">No photos yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <li key={img.id} className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-beige">
                <Image src={img.url} alt={img.alt_text ?? ""} fill sizes="200px" className="object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-sm bg-charcoal/80 px-1.5 py-0.5 text-xs capitalize text-warm-white">
                  {img.kind}
                </span>
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
