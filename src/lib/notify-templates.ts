import { ENQUIRY_STATUS_LABELS } from "@/lib/admin-status";
import { formatDate } from "@/lib/admin-helpers";

export type NotifyEnquiry = {
  name: string;
  ref_code: string;
  service_type: string | null;
  preferred_visit_date: string | null;
};

/**
 * One ready-to-edit WhatsApp message per status, in plain, polite English.
 * Admin can still change the words before sending; nothing is sent automatically.
 */
export function buildStatusMessage(status: string, businessName: string, e: NotifyEnquiry): string {
  const firstName = e.name.split(" ")[0] || e.name;
  const visitDate = formatDate(e.preferred_visit_date);
  const work = e.service_type ? ` for ${e.service_type}` : "";

  switch (status) {
    case "new":
      return `Hello ${firstName}, this is ${businessName}. We have received your request (${e.ref_code}). We will contact you shortly.`;
    case "contacted":
      return `Hello ${firstName}, this is ${businessName}. Thank you for speaking with us about your request (${e.ref_code}). Please let us know if you have any questions.`;
    case "site_visit":
      return visitDate
        ? `Hello ${firstName}, this is ${businessName}. We will visit your site on ${visitDate} for your request${work} (${e.ref_code}). Please let us know if this time does not work for you.`
        : `Hello ${firstName}, this is ${businessName}. We would like to visit your site to see the work needed${work} (${e.ref_code}). Please let us know a convenient date and time.`;
    case "quotation_sent":
      return `Hello ${firstName}, this is ${businessName}. We have prepared your quotation for ${e.ref_code}. Please check and let us know if you would like to proceed.`;
    case "confirmed":
      return `Hello ${firstName}, this is ${businessName}. Your work order (${e.ref_code}) is confirmed. We will share the start date soon.`;
    case "in_progress":
      return `Hello ${firstName}, this is ${businessName}. Your work (${e.ref_code}) is now in progress. We will keep you updated.`;
    case "completed":
      return `Hello ${firstName}, this is ${businessName}. Your work (${e.ref_code}) is now complete. Thank you for choosing us. We would be grateful if you could share a review on our website.`;
    case "closed":
      return `Hello ${firstName}, this is ${businessName}. Regarding your request (${e.ref_code}): please contact us if you need anything further.`;
    default:
      return `Hello ${firstName}, this is ${businessName}, regarding your request (${e.ref_code}).`;
  }
}

export const NOTIFY_STATUSES = Object.keys(ENQUIRY_STATUS_LABELS);
