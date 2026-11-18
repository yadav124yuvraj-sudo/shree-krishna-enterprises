"use server";
import { checkAndRecordUploadLimit, getUploaderTag } from "@/lib/upload-rate-limit";

import { submitEnquiry } from "@/lib/enquiry-submit";
import type { PublicFormState } from "@/lib/public-form-state";

export async function submitCustomDesign(_prev: PublicFormState, formData: FormData): Promise<PublicFormState> {
  return submitEnquiry("custom", formData);
}
