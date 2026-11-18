"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Checkbox, Select } from "@/components/ui/select";
import type { FormState } from "./actions";

export type ProjectFormValues = {
  title: string;
  location: string;
  description: string;
  completed_on: string;
  video_url: string;
  service_id: string;
  is_published: boolean;
  is_featured: boolean;
};

export function ProjectForm({
  values,
  services,
  action,
  submitLabel,
}: {
  values: ProjectFormValues;
  services: { id: string; title: string }[];
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <Field label="Title" htmlFor="title" error={err.title}>
        <Input id="title" name="title" defaultValue={values.title} required maxLength={120} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Location" htmlFor="location" hint="Optional, e.g. a city or area." error={err.location}>
          <Input id="location" name="location" defaultValue={values.location} maxLength={120} />
        </Field>
        <Field label="Service" htmlFor="service_id">
          <Select id="service_id" name="service_id" defaultValue={values.service_id}>
            <option value="">No specific service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </Select>
        </Field>
        <Field label="Completed on" htmlFor="completed_on" hint="Optional.">
          <Input id="completed_on" name="completed_on" type="date" defaultValue={values.completed_on} />
        </Field>
        <Field
          label="Video link"
          htmlFor="video_url"
          hint="Optional. YouTube or Vimeo link."
          error={err.video_url}
        >
          <Input id="video_url" name="video_url" type="url" defaultValue={values.video_url} placeholder="https://" />
        </Field>
      </div>
      <Field label="Description" htmlFor="description" error={err.description}>
        <Textarea id="description" name="description" defaultValue={values.description} rows={6} maxLength={4000} />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Checkbox id="is_published" name="is_published" label="Published" defaultChecked={values.is_published} />
        <Checkbox id="is_featured" name="is_featured" label="Featured on home page" defaultChecked={values.is_featured} />
      </div>

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
