"use client";

import { useActionState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import type { FormState } from "./actions";

function AddPhotoButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Uploading" : "Add photo"}</Button>;
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
  return (
    <div>
      <h2 className="text-2xl text-charcoal">More photos</h2>
      <p className="mt-1 text-stone">Shown on the design&apos;s detail page, along with the cover photo.</p>

      <form action={formAction} className="mt-5 flex flex-wrap items-end gap-3">
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
          className="block text-sm text-stone file:mr-4 file:h-11 file:rounded-sm file:border-0 file:bg-charcoal file:px-4 file:text-warm-white"
        />
        <AddPhotoButton />
      </form>
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
