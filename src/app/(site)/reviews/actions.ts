"use server";

import { revalidatePath } from "next/cache";
import { cleanText } from "@/lib/sanitize";
import { checkAndRecordUploadLimit } from "@/lib/upload-rate-limit";
import { createServiceClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

export type ReviewActionState = {
  ok: boolean;
  message: string;
};

const MAX_FILES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function submitReview(
  _prevState: ReviewActionState | null,
  formData: FormData,
): Promise<ReviewActionState> {
  const reviewerName = cleanText(formData.get("reviewer_name"), 100);
  const reviewerLocation = cleanText(formData.get("reviewer_location"), 100);
  const body = cleanText(formData.get("body"), 1500);
  const projectId = cleanText(formData.get("project_id"), 64);
  const rating = Number(formData.get("rating"));
  const privacyConsent = formData.get("privacy_consent") === "true" || formData.get("privacy_consent") === "on";

  if (!reviewerName) {
    return { ok: false, message: "Please enter your name." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, message: "Please select a rating between 1 and 5 stars." };
  }
  if (body.length < 10) {
    return { ok: false, message: "Please write at least 10 characters in your review." };
  }
  if (!privacyConsent) {
    return { ok: false, message: "Please tick the consent box before submitting your review." };
  }

  const rawFiles = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (rawFiles.length > MAX_FILES) {
    return { ok: false, message: "You can upload at most 2 photos per 24 hours." };
  }
  if (rawFiles.length > 0) {
    const limitCheck = await checkAndRecordUploadLimit(rawFiles.length);
    if (!limitCheck.allowed) {
      return { ok: false, message: limitCheck.message || "Daily upload limit (2 images / 24h) reached." };
    }
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
    let sb;
    try {
      sb = createServiceClient();
    } catch {
      sb = createPublicClient();
    }

    if (!sb) {
      return { ok: false, message: "Database is not configured." };
    }

    const { data: review, error: insertError } = await sb
      .from("reviews")
      .insert({
        reviewer_name: reviewerName,
        reviewer_location: reviewerLocation || null,
        rating,
        body,
        project_id: projectId || null,
        privacy_consent: true,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !review) {
      console.error("Review insert error:", insertError);
      return {
        ok: false,
        message: insertError?.message
          ? `Database error: ${insertError.message}`
          : "Could not save your review right now. Please try again.",
      };
    }

    const uploadedPaths: string[] = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const storagePath = `reviews/${review.id}/${Date.now()}-${i}.${ext}`;
      const bytes = await file.arrayBuffer();

      const { error: uploadError } = await sb.storage
        .from("customer-uploads")
        .upload(storagePath, bytes, { contentType: file.type, upsert: false });

      if (!uploadError) {
        uploadedPaths.push(storagePath);
      }
    }

    if (uploadedPaths.length > 0) {
      await sb.from("review_images").insert(
        uploadedPaths.map((storage_path) => ({
          review_id: review.id,
          storage_path,
        })),
      );
    }

    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");
    return {
      ok: true,
      message: "Thank you! Your review has been submitted and will appear once approved.",
    };
  } catch (err) {
    console.error("Review server error:", err);
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Something went wrong on the server.",
    };
  }
}
