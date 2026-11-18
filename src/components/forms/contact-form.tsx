"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitContactEnquiry, type ContactActionState } from "@/app/(site)/contact/actions";

export function ContactForm({
  services = [],
}: {
  services?: { id: string; title: string }[];
}) {
  const [state, formAction, isPending] = useActionState<ContactActionState | null, FormData>(
    submitContactEnquiry,
    null,
  );

  if (state?.ok) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-[#d4af37]/50 bg-white p-10 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)]"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-[#9A742E]">
          <CheckCircle2 className="size-9" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-sans text-2xl font-extrabold text-charcoal">
          Message Sent Successfully!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-[#EAE4D9] bg-white p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] sm:p-10"
    >
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A742E]">
          Direct Enquiry
        </span>
        <h2 className="mt-1 font-sans text-2xl font-extrabold text-charcoal sm:text-3xl">
          Send Us a Message
        </h2>
        <p className="mt-1.5 text-sm text-stone">
          Share your requirement or ask for a free site measurement in Bayad &amp; nearby areas.
        </p>
      </div>

      {/* Row 1: Name + Mobile */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact_name"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Your Name *
          </label>
          <input
            id="contact_name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
          />
        </div>

        <div>
          <label
            htmlFor="contact_phone"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Mobile / WhatsApp *
          </label>
          <input
            id="contact_phone"
            name="phone"
            type="tel"
            required
            maxLength={25}
            placeholder="10-digit mobile number"
            className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
          />
        </div>
      </div>

      {/* Row 2: Email + Location */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact_email"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Email <span className="font-normal text-stone">(Optional)</span>
          </label>
          <input
            id="contact_email"
            name="email"
            type="email"
            maxLength={120}
            placeholder="your@email.com"
            className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
          />
        </div>

        <div>
          <label
            htmlFor="contact_address"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Site Location / City
          </label>
          <input
            id="contact_address"
            name="address"
            type="text"
            maxLength={200}
            placeholder="Bayad, Modasa, Himatnagar etc."
            className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
          />
        </div>
      </div>

      {/* Row 3: Service Type */}
      <div className="mt-5">
        <label
          htmlFor="contact_service"
          className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
        >
          Work Type
        </label>
        <select
          id="contact_service"
          name="service_type"
          defaultValue=""
          className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
        >
          <option value="">Select POP / PVC requirement</option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="POP False Ceiling">POP False Ceiling</option>
          <option value="PVC Wall & Ceiling Panels">PVC Wall &amp; Ceiling Panels</option>
          <option value="Gypsum / Grid Ceiling">Gypsum / Grid Ceiling</option>
          <option value="Cornice & Wall Molding">Cornice &amp; Wall Molding</option>
          <option value="Complete Home / Office Interior">Complete Home / Office Interior</option>
        </select>
      </div>

      {/* Row 4: Requirement Message */}
      <div className="mt-5">
        <label
          htmlFor="contact_description"
          className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
        >
          Your Message / Requirement *
        </label>
        <textarea
          id="contact_description"
          name="description"
          required
          minLength={5}
          maxLength={1500}
          rows={4}
          placeholder="Tell us about your room size, ceiling or wall panel requirement, or preferred visit time..."
          className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3.5 text-sm leading-relaxed text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
        />
      </div>

      {state && !state.ok ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#c59b32] via-[#d4af37] to-[#b88924] px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-charcoal shadow-lg transition hover:brightness-105 disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden="true" />
        {isPending ? "Sending Message..." : "Send Message"}
      </button>
    </form>
  );
}
