/** Status lists and labels for the admin pipeline. Values match the CHECK constraints in setup.sql. */

export type Tone = "good" | "neutral" | "warn";

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "site_visit",
  "quotation_sent",
  "confirmed",
  "in_progress",
  "completed",
  "closed",
] as const;

export const ENQUIRY_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_visit: "Site visit",
  quotation_sent: "Quotation sent",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  closed: "Closed",
};

export const ENQUIRY_KINDS = ["quotation", "custom_design", "design", "project", "general"] as const;

export const ENQUIRY_KIND_LABELS: Record<string, string> = {
  quotation: "Quotation request",
  custom_design: "Custom design",
  design: "About a design",
  project: "About a project",
  general: "General",
};

export const APPLICATION_STATUSES = ["new", "reviewing", "contacted", "selected", "rejected"] as const;

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  selected: "Selected",
  rejected: "Rejected",
};

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;

export function enquiryTone(status: string): Tone {
  if (status === "new") return "warn";
  if (status === "confirmed" || status === "in_progress" || status === "completed") return "good";
  return "neutral";
}

export function applicationTone(status: string): Tone {
  if (status === "new") return "warn";
  if (status === "selected") return "good";
  return "neutral";
}

export function optionsFrom(values: readonly string[], labels: Record<string, string>) {
  return values.map((value) => ({ value, label: labels[value] ?? value }));
}
