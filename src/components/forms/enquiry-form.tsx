"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Checkbox, Select } from "@/components/ui/select";
import { PhotoPicker } from "@/components/forms/photo-picker";
import { MAX_PHOTOS, ROOM_TYPES, STYLE_OPTIONS } from "@/lib/enquiry-options";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { PublicFormState } from "@/lib/public-form-state";

export function EnquiryForm({
  mode,
  services,
  design,
  action,
  whatsappNumber,
}: {
  mode: "quote" | "custom";
  services: string[];
  design: { slug: string; title: string } | null;
  action: (prev: PublicFormState, formData: FormData) => Promise<PublicFormState>;
  whatsappNumber: string;
}) {
  const [state, formAction, pending] = useActionState<PublicFormState, FormData>(action, null);
  const [files, setFiles] = useState<File[]>([]);
  const [preparing, setPreparing] = useState(false);

  const err = state?.fieldErrors ?? {};
  const v = state?.values ?? {};
  const isQuote = mode === "quote";

  function handleSubmit(formData: FormData) {
    formData.delete("photos");
    for (const file of files) formData.append("photos", file);
    formAction(formData);
  }

  if (state?.ok) {
    const waLink = buildWhatsAppLink({
      whatsappNumber,
      message: state.refCode
        ? `Hello Shree Krishna Enterprises, I just sent a request on your website. Reference: ${state.refCode}.`
        : "Hello Shree Krishna Enterprises, I just sent a request on your website.",
    });
    return (
      <div role="status" className="rounded-sm border border-line bg-beige/50 p-8">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
          <Check aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-3xl text-charcoal">Request received</h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-charcoal">{state.message}</p>
        {state.refCode ? (
          <p className="mt-3 text-charcoal">
            Your reference number is <strong>{state.refCode}</strong>. Keep it if you call or message us.
          </p>
        ) : null}
        <p className="mt-3 max-w-xl text-stone">
          We will contact you on the phone number you gave, after reviewing your requirements.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="whatsapp">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />
              Message us on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-8" noValidate>
      {design ? (
        <p className="rounded-sm border border-line bg-beige/50 px-4 py-3 text-charcoal">
          You are requesting this design: <strong>{design.title}</strong>
        </p>
      ) : null}
      {design ? <input type="hidden" name="design" value={design.slug} /> : null}

      {/* Spam trap: real visitors never see or fill this. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="hp_note" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset className="space-y-5">
        <legend className="text-2xl text-charcoal">Your details</legend>
        <Field label="Your name" htmlFor="name" error={err.name}>
          <Input id="name" name="name" autoComplete="name" defaultValue={v.name ?? ""} maxLength={100} required />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone number" htmlFor="phone" error={err.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={v.phone ?? ""}
              maxLength={20}
              required
            />
          </Field>
          <Field label="Email (optional)" htmlFor="email" error={err.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={v.email ?? ""}
              maxLength={120}
            />
          </Field>
        </div>
        {isQuote ? (
          <Field label="Address of the site (optional)" htmlFor="address" error={err.address}>
            <Textarea id="address" name="address" rows={2} defaultValue={v.address ?? ""} maxLength={500} />
          </Field>
        ) : null}
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-2xl text-charcoal">About the work</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type of work" htmlFor="service_type" error={err.service_type}>
            <Select id="service_type" name="service_type" defaultValue={v.service_type ?? ""}>
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Room" htmlFor="room_type" error={err.room_type}>
            <Select id="room_type" name="room_type" defaultValue={v.room_type ?? ""}>
              <option value="">Select a room</option>
              {ROOM_TYPES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Room length in feet (optional)" htmlFor="length_ft" error={err.length_ft}>
            <Input id="length_ft" name="length_ft" inputMode="decimal" defaultValue={v.length_ft ?? ""} maxLength={7} />
          </Field>
          <Field label="Room width in feet (optional)" htmlFor="width_ft" error={err.width_ft}>
            <Input id="width_ft" name="width_ft" inputMode="decimal" defaultValue={v.width_ft ?? ""} maxLength={7} />
          </Field>
        </div>

        {!isQuote ? (
          <Field label="Style you like" htmlFor="style" error={err.style}>
            <Select id="style" name="style" defaultValue={v.style ?? ""}>
              <option value="">Select a style</option>
              {STYLE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        {isQuote ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Budget (optional)" htmlFor="budget_range" error={err.budget_range}>
              <Input id="budget_range" name="budget_range" defaultValue={v.budget_range ?? ""} maxLength={60} />
            </Field>
            <Field label="Preferred date for a site visit (optional)" htmlFor="preferred_visit_date" error={err.preferred_visit_date}>
              <Input
                id="preferred_visit_date"
                name="preferred_visit_date"
                type="date"
                defaultValue={v.preferred_visit_date ?? ""}
              />
            </Field>
          </div>
        ) : null}

        <Field
          label={isQuote ? "What work do you need? (optional)" : "Describe the design you want"}
          htmlFor="description"
          hint={isQuote ? "For example: false ceiling with cove lights in the hall." : undefined}
          error={err.description}
        >
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={v.description ?? ""}
            maxLength={4000}
            required={!isQuote}
          />
        </Field>
      </fieldset>

      <PhotoPicker max={MAX_PHOTOS} onChange={setFiles} onBusyChange={setPreparing} error={err.photos} />

      <div className="space-y-2">
        <Checkbox
          id="privacy_consent"
          name="privacy_consent"
          defaultChecked={v.privacy_consent === "on"}
          label="I agree that Shree Krishna Enterprises may contact me about this request."
        />
        <p className="text-sm text-stone">
          Read our{" "}
          <Link href="/privacy" className="underline hover:text-charcoal">
            Privacy Policy
          </Link>
          .
        </p>
        {err.privacy_consent ? (
          <p role="alert" className="text-sm text-red-700">
            {err.privacy_consent}
          </p>
        ) : null}
      </div>

      {state && !state.ok && state.message ? (
        <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending || preparing}>
        {pending ? "Sending" : isQuote ? "Send quotation request" : "Send design request"}
      </Button>
    </form>
  );
}
