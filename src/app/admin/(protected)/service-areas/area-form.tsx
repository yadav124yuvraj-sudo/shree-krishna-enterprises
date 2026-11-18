"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/select";
import { FormMessage } from "@/components/admin/form-message";
import type { FormState } from "@/lib/form-state";

export function AreaForm({
  idPrefix,
  values,
  action,
  submitLabel,
  resetOnSuccess = false,
}: {
  idPrefix: string;
  values: { name: string; sort_order: number; is_active: boolean };
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state?.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          name="name"
          aria-label="Area name"
          placeholder="Area name"
          defaultValue={values.name}
          maxLength={80}
          required
          className="w-56 max-w-full"
        />
        <Input
          name="sort_order"
          type="number"
          aria-label="Sort order (lower shows first)"
          title="Sort order (lower shows first)"
          min={0}
          max={9999}
          defaultValue={values.sort_order}
          className="w-24"
        />
        <Checkbox id={`${idPrefix}-active`} name="is_active" label="Shown" defaultChecked={values.is_active} />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving" : submitLabel}
        </Button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
