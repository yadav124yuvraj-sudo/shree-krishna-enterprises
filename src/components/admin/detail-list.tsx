import type { ReactNode } from "react";

export type DetailItem = { label: string; value: ReactNode | null | undefined };

/** Label/value list. Rows with no value are left out. */
export function DetailList({ items }: { items: DetailItem[] }) {
  const rows = items.filter((i) => i.value !== null && i.value !== undefined && i.value !== "");
  return (
    <dl className="divide-y divide-line rounded-sm border border-line">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
          <dt className="text-sm text-stone">{r.label}</dt>
          <dd className="whitespace-pre-line break-words text-charcoal">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
