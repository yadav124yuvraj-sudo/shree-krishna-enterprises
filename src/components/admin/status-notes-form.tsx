"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormMessage } from "./form-message";
import type { FormState } from "@/lib/form-state";

/** Status + private notes (+ optional follow-up date). Used for enquiries and worker applications. */
export function StatusNotesForm({
  statuses,
  values,
  withFollowUp = false,
  action,
}: {
  statuses: { value: string; label: string }[];
  values: { status: string; admin_notes: string; follow_up_on: string };
  withFollowUp?: boolean;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      <Field label="Status" htmlFor="status" error={err.status}>
        <Select id="status" name="status" defaultValue={values.status} className="max-w-xs">
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>

      {withFollowUp ? (
        <Field
          label="Follow up on"
          htmlFor="follow_up_on"
          hint="Optional. The enquiry is flagged in the list from this date."
          error={err.follow_up_on}
        >
          <Input id="follow_up_on" name="follow_up_on" type="date" defaultValue={values.follow_up_on} className="max-w-xs" />
        </Field>
      ) : null}

      <Field label="Private notes" htmlFor="admin_notes" hint="Only admins can see this." error={err.admin_notes}>
        <Textarea id="admin_notes" name="admin_notes" rows={5} maxLength={4000} defaultValue={values.admin_notes} />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving" : "Save changes"}
      </Button>
    </form>
  );
}
