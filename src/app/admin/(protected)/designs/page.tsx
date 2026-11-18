import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminListHeader, Badge, EmptyRow } from "@/components/admin/data-table";

export const metadata = { title: "Designs" };

export default async function AdminDesignsPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb
    .from("designs")
    .select("id, title, slug, is_published, is_featured")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminListHeader title="Designs" newHref="/admin/designs/new" newLabel="Add design" />
      <p className="mt-2 max-w-2xl text-stone">The design catalogue shown in the Design Gallery.</p>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">Could not load designs.</p>
        ) : !data || data.length === 0 ? (
          <EmptyRow title="No designs yet" newHref="/admin/designs/new" newLabel="Add your first design" />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {data.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <Link href={`/admin/designs/${d.id}`} className="font-medium text-charcoal hover:text-gold-deep">{d.title}</Link>
                  <p className="text-sm text-stone">/designs/{d.slug}</p>
                </div>
                <div className="flex gap-2">
                  {d.is_featured ? <Badge tone="warn">Featured</Badge> : null}
                  <Badge tone={d.is_published ? "good" : "neutral"}>{d.is_published ? "Published" : "Draft"}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
