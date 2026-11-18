import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

type Notification = { id: string; title: string; body: string | null; is_read: boolean; created_at: string };

export default async function DashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  const head = { count: "exact" as const, head: true };

  const [enquiries, newEnquiries, quotations, applications, pendingReviews, projects, publishedProjects, notifications] =
    await Promise.all([
      supabase.from("enquiries").select("*", head),
      supabase.from("enquiries").select("*", head).eq("status", "new"),
      supabase.from("enquiries").select("*", head).eq("kind", "quotation"),
      supabase.from("worker_applications").select("*", head),
      supabase.from("reviews").select("*", head).eq("status", "pending"),
      supabase.from("projects").select("*", head),
      supabase.from("projects").select("*", head).eq("is_published", true),
      supabase
        .from("notifications")
        .select("id, title, body, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const failed = [enquiries, newEnquiries, quotations, applications, pendingReviews, projects, publishedProjects].some(
    (r) => r.error,
  );

  const stats = [
    { label: "Total enquiries", value: enquiries.count },
    { label: "New enquiries", value: newEnquiries.count },
    { label: "Quotation requests", value: quotations.count },
    { label: "Worker applications", value: applications.count },
    { label: "Reviews waiting for approval", value: pendingReviews.count },
    { label: "Projects (published / total)", value: `${publishedProjects.count ?? 0} / ${projects.count ?? 0}` },
  ];

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Dashboard</h1>

      {failed ? (
        <p role="alert" className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          The database tables could not be read. Run <code>supabase/setup.sql</code> in the Supabase SQL editor,
          then reload this page.
        </p>
      ) : null}

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-line bg-beige/40 p-5">
            <dt className="text-sm text-stone">{s.label}</dt>
            <dd className="mt-2 font-serif text-4xl text-charcoal">{s.value ?? 0}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-2xl text-charcoal">Latest notifications</h2>
      {(notifications.data as Notification[] | null)?.length ? (
        <ul className="mt-4 divide-y divide-line rounded-sm border border-line">
          {(notifications.data as Notification[]).map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className={n.is_read ? "text-stone" : "font-medium text-charcoal"}>{n.title}</p>
                {n.body ? <p className="text-sm text-stone">{n.body}</p> : null}
              </div>
              <time dateTime={n.created_at} className="shrink-0 text-sm text-stone">
                {new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-stone">Nothing yet. New enquiries, reviews and applications will show up here.</p>
      )}
    </div>
  );
}
