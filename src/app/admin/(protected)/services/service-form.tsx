"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/select";
import type { FormState } from "./actions";

export type ServiceFormValues = {
  title: string;
  short_description: string;
  description: string;
  is_published: boolean;
  sort_order: number;
  cover_image_url: string | null;
};

export function ServiceForm({
  values,
  action,
  submitLabel,
}: {
  values: ServiceFormValues;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <Field label="Title" htmlFor="title" error={err.title}>
        <Input id="title" name="title" defaultValue={values.title} required maxLength={100} />
      </Field>
      <Field
        label="Short description"
        htmlFor="short_description"
        hint="Shown on cards and search results. One sentence."
        error={err.short_description}
      >
        <Input id="short_description" name="short_description" defaultValue={values.short_description} maxLength={200} />
      </Field>
      <Field label="Full description" htmlFor="description" error={err.description}>
        <Textarea id="description" name="description" defaultValue={values.description} rows={6} maxLength={4000} />
      </Field>

      <div>
        <span className="block text-sm font-medium text-charcoal">Cover photo</span>
        {values.cover_image_url ? (
          <div className="mt-2 flex items-center gap-4">
            <Image src={values.cover_image_url} alt="" width={120} height={90} className="rounded-sm object-cover" />
            <Checkbox id="remove_cover_image" name="remove_cover_image" label="Remove current photo" />
          </div>
        ) : null}
        <input
          type="file"
          name="cover_image"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="mt-2 block w-full text-sm text-stone file:mr-4 file:h-11 file:rounded-sm file:border-0 file:bg-charcoal file:px-4 file:text-warm-white"
        />
        <p className="mt-1 text-sm text-stone">JPG, PNG, WEBP or AVIF, up to 5 MB.</p>
      </div>

      <Field label="Sort order" htmlFor="sort_order" hint="Lower numbers show first." error={err.sort_order}>
        <Input id="sort_order" name="sort_order" type="number" min={0} max={9999} defaultValue={values.sort_order} className="max-w-32" />
      </Field>

      <Checkbox
        id="is_published"
        name="is_published"
        label="Published (visible on the website)"
        defaultChecked={values.is_published}
      />

      {state?.message ? (
        <p
          role={state.ok ? "status" : "alert"}
          className={
            state.ok
              ? "rounded-sm border border-green-200 bg-green-50 px-3 py-2 text-green-900"
              : "rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-red-800"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving" : submitLabel}
      </Button>
    </form>
  );
}
