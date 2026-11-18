import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/admin/data-table";
import { FilterChips, type Chip } from "@/components/admin/filter-chips";
import { EmptyState } from "@/components/states/empty-state";
import {
  ENQUIRY_KINDS,
  ENQUIRY_KIND_LABELS,
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  enquiryTone,
} from "@/lib/admin-status";
import { formatDate, todayIST } from "@/lib/admin-helpers";

export const metadata = { title: "Enquiries" };

type Row = {
  id: string;
  ref_code: string;
  kind: string;
  status: string;
  name: string;
  phone: string;
  service_type: string | null;
  follow_up_on: string | null;
  created_at: string;
};

function href(status?: string, kind?: string) {
  const p = new URLSearchParams();
  if (status) p.set("status", status);
  if (kind) p.set("kind", kind);
  const qs = p.toString();
  return qs ? `/admin/enquiries?${qs}` : "/admin/enquiries";
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; kind?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = ENQUIRY_STATUSES.find((s) => s === sp.status);
  const kind = ENQUIRY_KINDS.find((k) => k === sp.kind);

  const sb = await createClient();
  let query = sb
    .from("enquiries")
    .select("id, ref_code, kind, status, name, phone, service_type, follow_up_on, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  const rows = (data ?? []) as Row[];
  const today = todayIST();

  const statusChips: Chip[] = [
    { label: "All statuses", href: href(undefined, kind), active: !status },
    ...ENQUIRY_STATUSES.map((s) => ({
      label: ENQUIRY_STATUS_LABELS[s],
      href: href(s, kind),
      active: status === s,
    })),
  ];
  const kindChips: Chip[] = [
    { label: "All types", href: href(status, undefined), active: !kind },
    ...ENQUIRY_KINDS.map((k) => ({ label: ENQUIRY_KIND_LABELS[k], href: href(status, k), active: kind === k })),
  ];

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Enquiries</h1>
      <p className="mt-2 max-w-2xl text-stone">
        Quotation requests, custom design requests and general enquiries from the website. Newest first.
      </p>

      <div className="mt-6 space-y-3">
        <FilterChips label="Filter by status" items={statusChips} />
        <FilterChips label="Filter by type" items={kindChips} />
      </div>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load enquiries.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            title={status || kind ? "No enquiries match this filter" : "No enquiries yet"}
            description={
              status || kind
                ? "Try another filter."
                : "When a customer sends a quote or design request, it will appear here."
            }
          />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {rows.map((e) => {
              const due = e.follow_up_on && e.follow_up_on <= today && e.status !== "closed" && e.status !== "completed";
              return (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/enquiries/${e.id}`} className="font-medium text-charcoal hover:text-gold-deep">
                      {e.name}
                    </Link>
                    <p className="text-sm text-stone">
                      {e.ref_code} · {ENQUIRY_KIND_LABELS[e.kind] ?? e.kind}
                      {e.service_type ? ` · ${e.service_type}` : ""} · {formatDate(e.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {due ? <Badge tone="warn">Follow up due</Badge> : null}
                    <Badge tone={enquiryTone(e.status)}>{ENQUIRY_STATUS_LABELS[e.status] ?? e.status}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {rows.length === 200 ? (
          <p className="mt-3 text-sm text-stone">Showing the latest 200. Use the filters to narrow down.</p>
        ) : null}
      </div>
    </div>
  );
}
