import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminListHeader, Badge, EmptyRow } from "@/components/admin/data-table";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb
    .from("projects")
    .select("id, title, slug, is_published, is_featured, completed_on")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminListHeader title="Projects" newHref="/admin/projects/new" newLabel="Add project" />
      <p className="mt-2 max-w-2xl text-stone">Our completed work. Add photos after creating a project.</p>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load projects.
          </p>
        ) : !data || data.length === 0 ? (
          <EmptyRow title="No projects yet" newHref="/admin/projects/new" newLabel="Add your first project" />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {data.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <Link href={`/admin/projects/${p.id}`} className="font-medium text-charcoal hover:text-gold-deep">
                    {p.title}
                  </Link>
                  <p className="text-sm text-stone">/projects/{p.slug}</p>
                </div>
                <div className="flex gap-2">
                  {p.is_featured ? <Badge tone="warn">Featured</Badge> : null}
                  <Badge tone={p.is_published ? "good" : "neutral"}>{p.is_published ? "Published" : "Draft"}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
