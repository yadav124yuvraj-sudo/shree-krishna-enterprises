"use server";

import { revalidatePath } from "next/cache";
import { cleanText } from "@/lib/sanitize";
import { createServiceClient } from "@/lib/supabase/admin";
import { APPLICATION_STATUSES } from "@/lib/admin-status";

export type JoinActionState = {
  ok: boolean;
  message: string;
};

const VALID_ROLES = new Set(["Helper", "POP Expert", "PVC Installer", "Multi-skilled Worker"]);
const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function submitWorkerApplication(
  _prevState: JoinActionState | null,
  formData: FormData,
): Promise<JoinActionState> {
  const name = cleanText(formData.get("name"), 100);
  const rawPhone = cleanText(formData.get("phone"), 25);
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const location = cleanText(formData.get("location"), 100);
  const roleTitle = cleanText(formData.get("role_title"), 50);
  const experienceYears = Number(formData.get("experience_years"));
  const skills = cleanText(formData.get("skills"), 300);
  const expectedSalary = cleanText(formData.get("expected_salary"), 100);
  const availability = cleanText(formData.get("availability"), 100);
  const introduction = cleanText(formData.get("introduction"), 1500);

  if (!name) {
    return { ok: false, message: "Please enter your full name." };
  }
  if (phoneDigits.length < 10) {
    return { ok: false, message: "Please enter a valid 10-digit mobile number." };
  }
  if (!VALID_ROLES.has(roleTitle)) {
    return { ok: false, message: "Please select the type of work you do." };
  }
  if (!Number.isFinite(experienceYears) || experienceYears < 0 || experienceYears > 50) {
    return { ok: false, message: "Please enter valid years of experience (0 to 50)." };
  }

  const rawFiles = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (rawFiles.length > MAX_FILES) {
    return { ok: false, message: `You can upload at most ${MAX_FILES} photos.` };
  }

  for (const file of rawFiles) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return { ok: false, message: "Only JPG, PNG, or WebP images are allowed." };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, message: "Each photo must be under 5 MB." };
    }
  }

  try {
    const sb = createServiceClient();
    const initialStatus = APPLICATION_STATUSES[0] ?? "new";

    const { data: application, error: insertError } = await sb
      .from("worker_applications")
      .insert({
        name,
        phone: rawPhone,
        role_title: roleTitle,
        location: location || null,
        experience_years: Math.round(experienceYears),
        skills: skills || null,
        expected_salary: expectedSalary || null,
        availability: availability || null,
        introduction: introduction || null,
        status: initialStatus,
      })
      .select("id")
      .single();

    if (insertError || !application) {
      return { ok: false, message: "Could not submit your application right now. Please try again." };
    }

    const uploadedPaths: string[] = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const storagePath = `applications/${application.id}/${Date.now()}-${i}.${ext}`;
      const bytes = await file.arrayBuffer();

      const { error: uploadError } = await sb.storage
        .from("customer-uploads")
        .upload(storagePath, bytes, { contentType: file.type, upsert: false });

      if (!uploadError) {
        uploadedPaths.push(storagePath);
      }
    }

    if (uploadedPaths.length > 0) {
      await sb.from("worker_application_images").insert(
        uploadedPaths.map((storage_path) => ({
          application_id: application.id,
          storage_path,
        })),
      );
    }

    revalidatePath("/admin/applications");
    revalidatePath("/admin");
    return {
      ok: true,
      message: "Application submitted! Our team will review your details and call you soon.",
    };
  } catch {
    return { ok: false, message: "Something went wrong on the server. Please try again later." };
  }
}
