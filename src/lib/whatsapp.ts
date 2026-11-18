/**
 * WhatsApp helpers.
 * If no business number is configured, the link falls back to wa.me/?text=
 * which opens WhatsApp's contact chooser, so the button never breaks.
 */

type EnquiryKind = "design" | "project" | "service" | "general";

export function buildWhatsAppLink(opts: {
  whatsappNumber: string;
  message: string;
}): string {
  const number = opts.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(opts.message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** Builds the prefilled message for an item enquiry (design, project, service). */
export function buildEnquiryMessage(opts: {
  kind: EnquiryKind;
  itemName?: string;
  url?: string;
}): string {
  const { kind, itemName, url } = opts;
  if (kind === "general" || !itemName) {
    return "Hello Shree Krishna Enterprises, I would like to enquire about your POP / PVC work.";
  }
  const label =
    kind === "design" ? "design" : kind === "project" ? "project" : "service";
  const lines = [
    `Hello Shree Krishna Enterprises, I am interested in this ${label}: ${itemName}.`,
  ];
  if (url) lines.push(`Link: ${url}`);
  lines.push("Please share more details.");
  return lines.join("\n");
}
