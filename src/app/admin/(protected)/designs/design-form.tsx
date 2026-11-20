"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Checkbox, Select } from "@/components/ui/select";
import { compressImage } from "@/lib/compress-image";
import type { FormState } from "./actions";
import type { Category } from "@/lib/types";

const MAX_DIRECT_BYTES = 3.5 * 1024 * 1024; // 3.5 MB

export type DesignFormValues = {
  title: string;
  description: string;
  service_id: string;
  is_published: boolean;
  is_featured: boolean;
  category_ids: string[];
  cover_image_url: string | null;
};

const KIND_LABEL: Record<string, string> = { service: "Material", room: "Room", type: "Type", style: "Style", other: "Other" };

export function DesignForm({
  values,
  services,
  categories,
  action,
  submitLabel,
}: {
  values: DesignFormValues;
  services: { id: string; title: string }[];
  categories: Category[];
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const [compressing, setCompressing] = useState(false);
  const [sizeNote, setSizeNote] = useState<string | null>(null);
  const err = state?.fieldErrors ?? {};

  const byKind = new Map<string, Category[]>();
  for (const c of categories) byKind.set(c.kind, [...(byKind.get(c.kind) ?? []), c]);

  async function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
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
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <Field label="Title" htmlFor="title" error={err.title}>
        <Input id="title" name="title" defaultValue={values.title} required maxLength={120} />
      </Field>
      <Field label="Related service" htmlFor="service_id">
        <Select id="service_id" name="service_id" defaultValue={values.service_id}>
          <option value="">No specific service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </Select>
      </Field>
      <Field label="Description" htmlFor="description" error={err.description}>
        <Textarea id="description" name="description" defaultValue={values.description} rows={5} maxLength={4000} />
      </Field>

      <fieldset>
        <legend className="text-sm font-medium text-charcoal">Categories</legend>
        <div className="mt-2 space-y-3">
          {[...byKind.entries()].map(([kind, group]) => (
            <div key={kind} className="flex flex-wrap items-center gap-3">
              <span className="w-20 text-sm text-stone">{KIND_LABEL[kind] ?? kind}</span>
              {group.map((c) => (
                <label key={c.id} className="flex items-center gap-1.5 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    name="category_ids"
                    value={c.id}
                    defaultChecked={values.category_ids.includes(c.id)}
                    className="size-4 rounded-sm border-line accent-gold"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          ))}
        </div>
      </fieldset>

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
          onChange={handleCoverChange}
          className="mt-2 block w-full text-sm text-stone file:mr-4 file:h-11 file:rounded-sm file:border-0 file:bg-charcoal file:px-4 file:text-warm-white"
        />
        {compressing ? <p className="mt-1.5 text-xs text-stone">Optimizing large photo...</p> : null}
        {sizeNote ? <p className="mt-1.5 text-xs text-green-900">{sizeNote}</p> : null}
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox id="is_published" name="is_published" label="Published" defaultChecked={values.is_published} />
        <Checkbox id="is_featured" name="is_featured" label="Featured on home page" defaultChecked={values.is_featured} />
      </div>

      {state?.message ? (
        <p
          role={state.ok ? "status" : "alert"}
          className={state.ok ? "rounded-sm border border-green-200 bg-green-50 px-3 py-2 text-green-900" : "rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-red-800"}
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending || compressing}>
        {compressing ? "Preparing photo..." : pending ? "Saving" : submitLabel}
      </Button>
    </form>
  );
}