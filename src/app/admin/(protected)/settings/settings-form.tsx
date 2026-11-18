"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { saveSettings, type SettingsState } from "./actions";

export type SettingsValues = {
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  working_hours: string;
  map_embed_url: string;
  about_intro: string;
  about_story: string;
  about_workmanship: string;
  about_team: string;
  about_details: string;
};

export function SettingsForm({ values }: { values: SettingsValues }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettings, null);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-8" noValidate>
      <div className="space-y-6">
        <h2 className="border-b border-line pb-2 text-xl text-charcoal">Contact &amp; General Details</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Business name" htmlFor="business_name" error={err.business_name}>
            <Input id="business_name" name="business_name" defaultValue={values.business_name} required />
          </Field>
          <Field label="Tagline" htmlFor="tagline" error={err.tagline}>
            <Input id="tagline" name="tagline" defaultValue={values.tagline} required />
          </Field>
          <Field label="Phone" htmlFor="phone" hint="Shown on the website and used for the call button." error={err.phone}>
            <Input id="phone" name="phone" type="tel" defaultValue={values.phone} placeholder="+91 98765 43210" />
          </Field>
          <Field label="WhatsApp number" htmlFor="whatsapp_number" hint="Country code first, no plus sign. Example: 919876543210." error={err.whatsapp_number}>
            <Input id="whatsapp_number" name="whatsapp_number" inputMode="numeric" defaultValue={values.whatsapp_number} />
          </Field>
          <Field label="Email" htmlFor="email" error={err.email}>
            <Input id="email" name="email" type="email" defaultValue={values.email} />
          </Field>
          <Field label="Working hours" htmlFor="working_hours" error={err.working_hours}>
            <Input id="working_hours" name="working_hours" defaultValue={values.working_hours} placeholder="Mon to Sat, 9 am to 7 pm" />
          </Field>
        </div>
        <Field label="Business address" htmlFor="address" error={err.address}>
          <Textarea id="address" name="address" defaultValue={values.address} rows={3} />
        </Field>
        <Field
          label="Google Maps embed link"
          htmlFor="map_embed_url"
          hint="Google Maps, Share, Embed a map, copy the src link from the code."
          error={err.map_embed_url}
        >
          <Input id="map_embed_url" name="map_embed_url" defaultValue={values.map_embed_url} />
        </Field>
      </div>

      <div className="space-y-6">
        <h2 className="border-b border-line pb-2 text-xl text-charcoal">About Us Page Content</h2>
        <p className="text-sm text-stone">
          Edit the text shown on your public About Us page (/about). Leave any box empty to use the default text.
        </p>
        <Field label="Short Introduction (Top of About page)" htmlFor="about_intro" error={err.about_intro}>
          <Textarea id="about_intro" name="about_intro" defaultValue={values.about_intro} rows={2} />
        </Field>
        <Field label="Our Story (When & why you started)" htmlFor="about_story" error={err.about_story}>
          <Textarea id="about_story" name="about_story" defaultValue={values.about_story} rows={4} />
        </Field>
        <Field label="Our Workmanship (Quality & process)" htmlFor="about_workmanship" error={err.about_workmanship}>
          <Textarea id="about_workmanship" name="about_workmanship" defaultValue={values.about_workmanship} rows={3} />
        </Field>
        <Field label="The Team (Owner name & team roles)" htmlFor="about_team" error={err.about_team}>
          <Textarea id="about_team" name="about_team" defaultValue={values.about_team} rows={3} />
        </Field>
        <Field label="Service Area & Extra Details" htmlFor="about_details" error={err.about_details}>
          <Textarea id="about_details" name="about_details" defaultValue={values.about_details} rows={3} />
        </Field>
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
        {pending ? "Saving" : "Save settings"}
      </Button>
    </form>
  );
}
