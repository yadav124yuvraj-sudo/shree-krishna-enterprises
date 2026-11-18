"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/select";
import { FormMessage } from "@/components/admin/form-message";
import type { FormState } from "@/lib/form-state";

export type FaqFormValues = {
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
};

export function FaqForm({
  values,
  action,
  submitLabel,
}: {
  values: FaqFormValues;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <Field label="Question" htmlFor="question" error={err.question}>
        <Input id="question" name="question" defaultValue={values.question} required maxLength={300} />
      </Field>
      <Field label="Answer" htmlFor="answer" hint="Write only what is really true for your business." error={err.answer}>
        <Textarea id="answer" name="answer" defaultValue={values.answer} rows={6} maxLength={3000} required />
      </Field>
      <Field label="Sort order" htmlFor="sort_order" hint="Lower numbers show first." error={err.sort_order}>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          min={0}
          max={9999}
          defaultValue={values.sort_order}
          className="max-w-32"
        />
      </Field>
      <Checkbox
        id="is_published"
        name="is_published"
        label="Published (visible on the website)"
        defaultChecked={values.is_published}
      />

      <FormMessage state={state} />

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving" : submitLabel}
      </Button>
    </form>
  );
}
