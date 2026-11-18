"use server";

import { revalidatePath } from "next/cache";
import { cleanText } from "@/lib/sanitize";
import { createServiceClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { ENQUIRY_STATUSES } from "@/lib/admin-status";

export type ContactActionState = {
  ok: boolean;
  message: string;
};

export async function submitContactEnquiry(
  _prevState: ContactActionState | null,
  formData: FormData,
): Promise<ContactActionState> {
  const name = cleanText(formData.get("name"), 100);
  const rawPhone = cleanText(formData.get("phone"), 25);
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const email = cleanText(formData.get("email"), 120);
  const address = cleanText(formData.get("address"), 200);
  const serviceType = cleanText(formData.get("service_type"), 100);
  const description = cleanText(formData.get("description"), 1500);

  if (!name) {
    return { ok: false, message: "Please enter your name." };
  }
  if (phoneDigits.length < 10) {
    return { ok: false, message: "Please enter a valid 10-digit mobile number." };
  }
  if (description.length < 5) {
    return { ok: false, message: "Please enter a brief message about your requirement." };
  }

  try {
    let sb;
    try {
      sb = createServiceClient();
    } catch {
      sb = createPublicClient();
    }

    if (!sb) {
      return { ok: false, message: "Database connection is not configured." };
    }

    const initialStatus = ENQUIRY_STATUSES[0] ?? "new";
    const refCode = `SKE-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const basePayload: Record<string, unknown> = {
      ref_code: refCode,
      kind: "quote",
      status: initialStatus,
      name,
      phone: rawPhone,
      email: email || null,
      address: address || null,
      service_type: serviceType || null,
      description,
      privacy_consent: true,
    };

    let { error } = await sb.from("enquiries").insert(basePayload);

    // Fallback if privacy_consent column does not exist
    if (error && error.message?.includes("privacy_consent")) {
      delete basePayload.privacy_consent;
      const retry = await sb.from("enquiries").insert(basePayload);
      error = retry.error;
    }

    // Fallback if enquiries_kind_check expects 'general' instead of 'quote'
    if (error && error.message?.includes("enquiries_kind_check")) {
      for (const candidateKind of ["general", "custom_design", "site_visit", "callback"]) {
        const retryKind = await sb
          .from("enquiries")
          .insert({ ...basePayload, kind: candidateKind });
        if (!retryKind.error) {
          error = null;
          break;
        }
        error = retryKind.error;
      }
    }

    if (error) {
      console.error("Enquiry insert error:", error);
      return {
        ok: false,
        message: `Database error: ${error.message}`,
      };
    }

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return {
      ok: true,
      message: `Thank you, ${name}! Your request (${refCode}) has been received. We will call you back shortly.`,
    };
  } catch (err) {
    console.error("Enquiry server error:", err);
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Something went wrong on the server.",
    };
  }
}
