import "server-only";
import { z } from "zod";
import { cleanText } from "@/lib/sanitize";
import { createServiceClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { filesFrom, readPhotos, storePhotos } from "@/lib/customer-upload";
import { todayIST } from "@/lib/admin-helpers";
import { ROOM_TYPES } from "@/lib/enquiry-options";
import type { PublicFormState } from "@/lib/public-form-state";

type Mode = "quote" | "custom";

const optional = (re: RegExp, message: string) => z.string().refine((v) => v === "" || re.test(v), message);

const dimension = z
  .string()
  .refine((v) => v === "" || /^\d{1,3}(\.\d{1,2})?$/.test(v), "Enter a number, for example 12 or 12.5.")
  .refine((v) => v === "" || Number(v) > 0, "Enter a number above 0.");

function inOneYear(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function buildSchema(mode: Mode) {
  return z.object({
    name: z.string().min(2, "Enter your name.").max(100),
    phone: z.string().regex(/^\+?[0-9]{10,13}$/, "Enter a valid phone number, for example 98765 43210."),
    email: z
      .string()
      .max(120)
      .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address."),
    address: z.string().max(500),
    service_type: z.string().max(100),
    room_type: z.string().refine((v) => v === "" || (ROOM_TYPES as readonly string[]).includes(v), "Choose a room."),
    style: z.string().max(60),
    budget_range: z.string().max(60),
    description:
      mode === "custom"
        ? z.string().min(10, "Tell us a little about the design you want.").max(4000)
        : z.string().max(4000),
    preferred_visit_date: optional(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.").refine(
      (v) => v === "" || (v >= todayIST() && v <= inOneYear()),
      "Choose a date from today up to one year ahead.",
    ),
    length_ft: dimension,
    width_ft: dimension,
    privacy_consent: z.boolean().refine((v) => v, "Please tick this box to continue."),
  });
}

const GENERIC_ERROR =
  "We could not send your request right now. Please try again in a moment, or call or WhatsApp us.";

/**
 * Handles the Quote form and the Custom Design form.
 * Order: spam trap, validation, photo check, rate limit, save enquiry, save photos.
 */
export async function submitEnquiry(mode: Mode, formData: FormData): Promise<PublicFormState> {
  const text = (key: string, max: number) => cleanText(formData.get(key), max);

  // Hidden field that only bots fill in. Pretend it worked.
  if (text("hp_note", 200)) return { ok: true, message: "Thank you." };

  const typed = {
    name: text("name", 100),
    phone: text("phone", 30),
    email: text("email", 120),
    address: text("address", 500),
    service_type: text("service_type", 100),
    room_type: text("room_type", 40),
    style: text("style", 60),
    budget_range: text("budget_range", 60),
    description: text("description", 4000),
    preferred_visit_date: text("preferred_visit_date", 10),
    length_ft: text("length_ft", 10),
    width_ft: text("width_ft", 10),
    privacy_consent: formData.get("privacy_consent") === "on",
  };
  const designSlug = text("design", 120);
  const values: Record<string, string> = {
    ...typed,
    privacy_consent: typed.privacy_consent ? "on" : "",
  };

  const parsed = buildSchema(mode).safeParse({ ...typed, phone: typed.phone.replace(/[\s()-]/g, "") });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors, values };
  }
  const d = parsed.data;

  const checked = await readPhotos(filesFrom(formData));
  if ("error" in checked) {
    return { ok: false, message: checked.error, fieldErrors: { photos: checked.error }, values };
  }

  // Limits per visitor and per phone number.
  const ip = await getClientIp();
  const allowedByIp = ip ? await checkRateLimit(`enquiry:ip:${ip}`, 6, 60 * 60) : true;
  const allowedByPhone = await checkRateLimit(`enquiry:phone:${d.phone}`, 3, 24 * 60 * 60);
  if (!allowedByIp || !allowedByPhone) {
    return {
      ok: false,
      message: "You have already sent a few requests. Please wait a while, or call or WhatsApp us.",
      values,
    };
  }

  try {
    const sb = createServiceClient();

    let designId: string | null = null;
    if (mode === "custom" && designSlug) {
      const { data: design } = await sb
        .from("designs")
        .select("id")
        .eq("slug", designSlug)
        .eq("is_published", true)
        .maybeSingle();
      designId = design?.id ?? null;
    }

    const { data: enquiry, error } = await sb
      .from("enquiries")
      .insert({
        kind: mode === "quote" ? "quotation" : designId ? "design" : "custom_design",
        name: d.name,
        phone: d.phone,
        email: d.email || null,
        address: d.address || null,
        service_type: d.service_type || null,
        room_type: d.room_type || null,
        style: d.style || null,
        budget_range: d.budget_range || null,
        description: d.description || null,
        preferred_visit_date: d.preferred_visit_date || null,
        length_ft: d.length_ft ? Number(d.length_ft) : null,
        width_ft: d.width_ft ? Number(d.width_ft) : null,
        design_id: designId,
        privacy_consent: true,
      })
      .select("id, ref_code")
      .single();
    if (error || !enquiry) return { ok: false, message: GENERIC_ERROR, values };

    let photoNote = "";
    if (checked.photos.length > 0) {
      const saved = await storePhotos(`enquiries/${enquiry.id}`, checked.photos);
      if (saved.length > 0) {
        await sb
          .from("enquiry_images")
          .insert(saved.map((storage_path) => ({ enquiry_id: enquiry.id, storage_path })));
      }
      if (saved.length < checked.photos.length) {
        photoNote = " Some photos could not be uploaded. You can send them to us on WhatsApp.";
      }
    }

    return {
      ok: true,
      message: `Thank you. We have received your request.${photoNote}`,
      refCode: enquiry.ref_code,
    };
  } catch {
    return { ok: false, message: GENERIC_ERROR, values };
  }
}
