"use server";

import { submitEnquiry } from "@/lib/enquiry-submit";
import type { PublicFormState } from "@/lib/public-form-state";

export async function submitQuote(_prev: PublicFormState, formData: FormData): Promise<PublicFormState> {
  return submitEnquiry("quote", formData);
}
