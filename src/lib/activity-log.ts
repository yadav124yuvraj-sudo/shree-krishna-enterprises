import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Records an admin action in admin_activity_logs. Never throws. */
export async function logActivity(opts: {
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    const supabase = await createClient();
    await supabase.from("admin_activity_logs").insert({
      admin_id: opts.adminId,
      action: opts.action,
      entity_type: opts.entityType ?? null,
      entity_id: opts.entityId ?? null,
      details: opts.details ?? null,
    });
  } catch {
    // Logging must never break the action being logged.
  }
}
