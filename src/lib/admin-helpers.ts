/** Small display helpers for admin screens. Dates are shown in Indian time. */

const TZ = "Asia/Kolkata";

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

/** Today's date as YYYY-MM-DD in Indian time (to compare with date columns). */
export function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^+0-9]/g, "")}`;
}

/** wa.me link. A 10 digit Indian number gets the 91 country code. */
export function whatsappLink(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}`;
}
