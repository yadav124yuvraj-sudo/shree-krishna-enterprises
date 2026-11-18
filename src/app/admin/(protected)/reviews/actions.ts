"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity-log";
import { REVIEW_STATUSES } from "@/lib/admin-status";
import { removePrivateFiles } from "@/lib/private-files";

function refresh() {
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function setReviewStatus(id: string, status: string) {
  const session = await requireAdmin();
  if (!REVIEW_STATUSES.some((s) => s === status)) return;
  const sb = await createClient();
  const { error } = await sb
    .from("reviews")
    .update({ status, moderated_by: session.userId, moderated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return;

  if (status === "approved") {
    try {
      const service = createServiceClient();
      const { data: images } = await service
        .from("review_images")
        .select("storage_path")
        .eq("review_id", id);
      for (const img of images ?? []) {
        const { data: fileData } = await service.storage
          .from("customer-uploads")
          .download(img.storage_path);
        if (fileData) {
          await service.storage
            .from("public-media")
            .upload(img.storage_path, fileData, { contentType: fileData.type || "image/jpeg", upsert: true });
        }
      }
    } catch {
      // Best-effort copy so approval never fails
    }
  }

  await logActivity({
    adminId: session.userId,
    action: `review_${status}`,
    entityType: "reviews",
    entityId: id,
  });
  refresh();
}

export async function setReviewVerified(id: string, verified: boolean) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { error } = await sb.from("reviews").update({ is_verified: verified }).eq("id", id);
  if (error) return;
  await logActivity({
    adminId: session.userId,
    action: verified ? "review_mark_verified" : "review_unmark_verified",
    entityType: "reviews",
    entityId: id,
  });
  refresh();
}

export async function deleteReview(id: string) {
  const session = await requireAdmin();
  const sb = await createClient();
  const { data: images } = await sb.from("review_images").select("storage_path").eq("review_id", id);
  const { error } = await sb.from("reviews").delete().eq("id", id);
  if (error) return;
  const paths = (images ?? []).map((i: { storage_path: string }) => i.storage_path);
  await removePrivateFiles(paths);
  try {
    const service = createServiceClient();
    if (paths.length > 0) await service.storage.from("public-media").remove(paths);
  } catch {
    // best-effort cleanup
  }
  await logActivity({ adminId: session.userId, action: "delete_review", entityType: "reviews", entityId: id });
  refresh();
}
