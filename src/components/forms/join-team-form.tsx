"use client";

import { useActionState } from "react";
import { submitWorkerApplication, type JoinActionState } from "@/app/(site)/join-our-team/actions";
import { Button } from "@/components/ui/button";

export function JoinTeamForm() {
  const [state, formAction, isPending] = useActionState<JoinActionState | null, FormData>(
    submitWorkerApplication,
    null,
  );

  if (state?.ok) {
    return (
      <div
        role="status"
        className="rounded-sm border border-line bg-warm-white p-6 text-charcoal sm:p-8"
      >
        <h3 className="font-serif text-2xl">Application received</h3>
        <p className="mt-2 leading-relaxed text-stone">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-sm border border-line bg-warm-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-charcoal">
            Full Name *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Suresh Kumar"
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-charcoal outline-none focus:border-gold-deep"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal">
            Mobile / WhatsApp Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={25}
            placeholder="e.g. 98765 43210"
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-charcoal outline-none focus:border-gold-deep"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-charcoal">
            Work / Role *
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue="POP Expert"
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-charcoal outline-none focus:border-gold-deep"
          >
            <option value="Helper">Helper</option>
            <option value="POP Expert">POP Expert</option>
            <option value="PVC Installer">PVC Installer</option>
            <option value="Multi-skilled Worker">Multi-skilled Worker</option>
          </select>
        </div>

        <div>
          <label htmlFor="experience_years" className="block text-sm font-medium text-charcoal">
            Experience (Years) *
          </label>
          <input
            id="experience_years"
            name="experience_years"
            type="number"
            min={0}
            max={50}
            defaultValue={1}
            required
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-charcoal outline-none focus:border-gold-deep"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-charcoal">
            Current Village / City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            maxLength={100}
            placeholder="e.g. Bayad"
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-charcoal outline-none focus:border-gold-deep"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-charcoal">
          About Your Work (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="Mention false ceiling, cornice, wall paneling, or tools you know how to use..."
          className="mt-1.5 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-charcoal outline-none focus:border-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-charcoal">
          Photo of Yourself or Past Work (Optional)
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-1.5 block w-full text-sm text-stone file:mr-4 file:rounded-sm file:border-0 file:bg-beige file:px-4 file:py-2 file:text-sm file:font-medium file:text-charcoal hover:file:bg-gold/20"
        />
        <p className="mt-1 text-xs text-stone">JPG, PNG, or WebP. Max 5 MB.</p>
      </div>

      {state && !state.ok ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
