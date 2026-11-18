import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminListHeader, Badge, EmptyRow } from "@/components/admin/data-table";

export const metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb
    .from("faqs")
    .select("id, question, is_published, sort_order")
    .order("sort_order")
    .order("created_at");

  return (
    <div>
      <AdminListHeader title="FAQs" newHref="/admin/faqs/new" newLabel="Add FAQ" />
      <p className="mt-2 max-w-2xl text-stone">
        Frequently asked questions. Only published ones appear on the website, in order of the sort number.
      </p>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load FAQs.
          </p>
        ) : !data || data.length === 0 ? (
          <EmptyRow title="No FAQs yet" newHref="/admin/faqs/new" newLabel="Add your first FAQ" />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {data.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/faqs/${f.id}`} className="font-medium text-charcoal hover:text-gold-deep">
                    {f.question}
                  </Link>
                  <p className="text-sm text-stone">Order {f.sort_order}</p>
                </div>
                <Badge tone={f.is_published ? "good" : "neutral"}>{f.is_published ? "Published" : "Draft"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
