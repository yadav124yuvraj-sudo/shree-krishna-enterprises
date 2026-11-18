import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signedUrlsFor } from "@/lib/private-files";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { FilterChips, type Chip } from "@/components/admin/filter-chips";
import { PhotoGrid } from "@/components/admin/photo-grid";
import { EmptyState } from "@/components/states/empty-state";
import { formatDate } from "@/lib/admin-helpers";
import { deleteReview, setReviewStatus, setReviewVerified } from "./actions";

export const metadata = { title: "Reviews" };

type ReviewRow = {
  id: string;
  reviewer_name: string;
  reviewer_location: string | null;
  rating: number;
  body: string;
  status: "pending" | "approved" | "rejected";
  is_verified: boolean;
  created_at: string;
  projects: { title: string } | null;
  review_images: { id: string; storage_path: string }[] | null;
};

const TABS = ["pending", "approved", "rejected", "all"] as const;
const TAB_LABELS: Record<string, string> = { pending: "Waiting", approved: "Approved", rejected: "Rejected", all: "All" };

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.find((t) => t === sp.status) ?? "pending";

  const sb = await createClient();
  const head = { count: "exact" as const, head: true };

  let query = sb
    .from("reviews")
    .select(
      "id, reviewer_name, reviewer_location, rating, body, status, is_verified, created_at, projects(title), review_images(id, storage_path)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (tab !== "all") query = query.eq("status", tab);

  const [{ data, error }, pending, approved, rejected] = await Promise.all([
    query,
    sb.from("reviews").select("*", head).eq("status", "pending"),
    sb.from("reviews").select("*", head).eq("status", "approved"),
    sb.from("reviews").select("*", head).eq("status", "rejected"),
  ]);

  const rows = (data ?? []) as unknown as ReviewRow[];
  const urls = await signedUrlsFor(rows.flatMap((r) => (r.review_images ?? []).map((i) => i.storage_path)));
  const counts: Record<string, number | null> = {
    pending: pending.count,
    approved: approved.count,
    rejected: rejected.count,
    all: null,
  };

  const chips: Chip[] = TABS.map((t) => ({
    label: TAB_LABELS[t],
    href: `/admin/reviews?status=${t}`,
    active: tab === t,
    count: counts[t],
  }));

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Reviews</h1>
      <p className="mt-2 max-w-2xl text-stone">
        Only approved reviews appear on the website. Read each one before approving. Mark a review as
        &quot;verified&quot; only if the person really was your customer.
      </p>

      <div className="mt-6">
        <FilterChips label="Filter reviews" items={chips} />
      </div>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load reviews.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            title={tab === "pending" ? "No reviews waiting" : "No reviews here"}
            description="New reviews from customers will show up here for approval."
          />
        ) : (
          <ul className="space-y-4">
            {rows.map((r) => {
              const photos = (r.review_images ?? []).flatMap((i) => {
                const url = urls.get(i.storage_path);
                return url ? [{ id: i.id, url }] : [];
              });
              return (
                <li key={r.id} className="rounded-sm border border-line p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-charcoal">
                        {r.reviewer_name}
                        {r.reviewer_location ? (
                          <span className="font-normal text-stone"> · {r.reviewer_location}</span>
                        ) : null}
                      </p>
                      <p className="text-sm text-stone">
                        <span aria-label={`${r.rating} out of 5 stars`} className="text-gold-deep">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>{" "}
                        · {formatDate(r.created_at)}
                        {r.projects?.title ? ` · ${r.projects.title}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={r.status === "approved" ? "good" : r.status === "pending" ? "warn" : "neutral"}>
                        {r.status === "pending" ? "Waiting" : r.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                      {r.is_verified ? <Badge tone="good">Verified customer</Badge> : null}
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-line break-words text-charcoal">{r.body}</p>
                  <PhotoGrid photos={photos} />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.status !== "approved" ? (
                      <form action={setReviewStatus.bind(null, r.id, "approved")}>
                        <Button type="submit" size="sm">
                          Approve
                        </Button>
                      </form>
                    ) : null}
                    {r.status !== "rejected" ? (
                      <form action={setReviewStatus.bind(null, r.id, "rejected")}>
                        <Button type="submit" size="sm" variant="outline">
                          Reject
                        </Button>
                      </form>
                    ) : null}
                    {r.status !== "pending" ? (
                      <form action={setReviewStatus.bind(null, r.id, "pending")}>
                        <Button type="submit" size="sm" variant="ghost">
                          Move back to waiting
                        </Button>
                      </form>
                    ) : null}
                    <form action={setReviewVerified.bind(null, r.id, !r.is_verified)}>
                      <Button type="submit" size="sm" variant="ghost">
                        {r.is_verified ? "Remove verified" : "Mark as verified customer"}
                      </Button>
                    </form>
                    <form action={deleteReview.bind(null, r.id)}>
                      <DeleteButton confirm={`Delete the review from ${r.reviewer_name}? This cannot be undone.`} />
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
