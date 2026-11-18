"use client";

import { useActionState } from "react";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { submitContactEnquiry, type ContactActionState } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";

export function QuickQuoteBox() {
  const [state, formAction, isPending] = useActionState<ContactActionState | null, FormData>(
    submitContactEnquiry,
    null,
  );

  if (state?.ok) {
    return (
      <div
        role="status"
        className="rounded-sm border border-gold/40 bg-warm-white p-6 text-charcoal shadow-2xl sm:p-8"
      >
        <CheckCircle2 className="size-10 text-gold-deep" aria-hidden="true" />
        <h2 className="mt-3 font-serif text-2xl">Estimate Request Received</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-sm border border-gold/30 bg-warm-white p-6 text-charcoal shadow-2xl sm:p-8"
    >
      <div className="border-b border-line pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold-deep">
          Free Site Visit &amp; Quote
        </span>
        <h2 className="mt-1 font-serif text-2xl text-charcoal">Get a Quick Estimate</h2>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="hq_name" className="block text-xs font-medium uppercase tracking-wide text-stone">
            Your Name *
          </label>
          <input
            id="hq_name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Rajesh Patel"
            className="mt-1 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-gold-deep"
          />
        </div>

        <div>
          <label htmlFor="hq_phone" className="block text-xs font-medium uppercase tracking-wide text-stone">
            Mobile / WhatsApp *
          </label>
          <input
            id="hq_phone"
            name="phone"
            type="tel"
            required
            maxLength={25}
            placeholder="e.g. 98765 43210"
            className="mt-1 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-gold-deep"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="hq_service" className="block text-xs font-medium uppercase tracking-wide text-stone">
              Service Needed
            </label>
            <select
              id="hq_service"
              name="service_type"
              defaultValue="POP False Ceiling"
              className="mt-1 w-full rounded-sm border border-line bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold-deep"
            >
              <option value="POP False Ceiling">POP False Ceiling</option>
              <option value="PVC Wall & Ceiling Panels">PVC Wall &amp; Ceiling</option>
              <option value="Gypsum Partition / Molding">Gypsum / Molding</option>
              <option value="Full Home Interior">Full Home Interior</option>
            </select>
          </div>

          <div>
            <label htmlFor="hq_address" className="block text-xs font-medium uppercase tracking-wide text-stone">
              City / Area
            </label>
            <input
              id="hq_address"
              name="address"
              type="text"
              maxLength={200}
              placeholder="e.g. Bayad"
              className="mt-1 w-full rounded-sm border border-line bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold-deep"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hq_desc" className="block text-xs font-medium uppercase tracking-wide text-stone">
            Room / Work Details *
          </label>
          <input
            id="hq_desc"
            name="description"
            type="text"
            required
            minLength={5}
            maxLength={500}
            placeholder="e.g. Living room 12x16 ft ceiling design"
            className="mt-1 w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-gold-deep"
          />
        </div>
      </div>

      {state && !state.ok ? (
        <p role="alert" className="mt-3 text-xs font-medium text-red-700">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending} className="mt-5 w-full">
        <PhoneCall className="size-4" aria-hidden="true" />
        {isPending ? "Sending Request..." : "Request Free Callback"}
      </Button>
    </form>
  );
}
