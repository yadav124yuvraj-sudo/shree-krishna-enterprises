import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminListHeader, Badge, EmptyRow } from "@/components/admin/data-table";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb
    .from("services")
    .select("id, title, slug, is_published, sort_order")
    .order("sort_order");

  return (
    <div>
      <AdminListHeader title="Services" newHref="/admin/services/new" newLabel="Add service" />
      <p className="mt-2 max-w-2xl text-stone">Only published services appear on the website.</p>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load services.
          </p>
        ) : !data || data.length === 0 ? (
          <EmptyRow title="No services yet" newHref="/admin/services/new" newLabel="Add your first service" />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {data.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <Link href={`/admin/services/${s.id}`} className="font-medium text-charcoal hover:text-gold-deep">
                    {s.title}
                  </Link>
                  <p className="text-sm text-stone">/services/{s.slug}</p>
                </div>
                <Badge tone={s.is_published ? "good" : "neutral"}>{s.is_published ? "Published" : "Draft"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
