import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/admin/data-table";
import { FilterChips, type Chip } from "@/components/admin/filter-chips";
import { EmptyState } from "@/components/states/empty-state";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, applicationTone } from "@/lib/admin-status";
import { formatDate } from "@/lib/admin-helpers";

export const metadata = { title: "Worker applications" };

type Row = {
  id: string;
  name: string;
  phone: string;
  role_title: string;
  location: string | null;
  experience_years: number | null;
  status: string;
  created_at: string;
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = APPLICATION_STATUSES.find((s) => s === sp.status);

  const sb = await createClient();
  let query = sb
    .from("worker_applications")
    .select("id, name, phone, role_title, location, experience_years, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  const rows = (data ?? []) as Row[];

  const chips: Chip[] = [
    { label: "All", href: "/admin/applications", active: !status },
    ...APPLICATION_STATUSES.map((s) => ({
      label: APPLICATION_STATUS_LABELS[s],
      href: `/admin/applications?status=${s}`,
      active: status === s,
    })),
  ];

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Worker applications</h1>
      <p className="mt-2 max-w-2xl text-stone">People who applied from the Join Our Team page. Newest first.</p>

      <div className="mt-6">
        <FilterChips label="Filter by status" items={chips} />
      </div>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load applications.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            title={status ? "No applications with this status" : "No applications yet"}
            description={status ? "Try another filter." : "Applications from the Join Our Team page will appear here."}
          />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {rows.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/applications/${a.id}`} className="font-medium text-charcoal hover:text-gold-deep">
                    {a.name}
                  </Link>
                  <p className="text-sm text-stone">
                    {a.role_title}
                    {a.location ? ` · ${a.location}` : ""}
                    {a.experience_years !== null ? ` · ${Number(a.experience_years)} yrs` : ""} ·{" "}
                    {formatDate(a.created_at)}
                  </p>
                </div>
                <Badge tone={applicationTone(a.status)}>{APPLICATION_STATUS_LABELS[a.status] ?? a.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
