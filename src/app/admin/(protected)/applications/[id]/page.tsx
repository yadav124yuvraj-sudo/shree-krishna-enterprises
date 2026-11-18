import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signedUrlsFor } from "@/lib/private-files";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { DetailList } from "@/components/admin/detail-list";
import { PhotoGrid } from "@/components/admin/photo-grid";
import { StatusNotesForm } from "@/components/admin/status-notes-form";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, applicationTone, optionsFrom } from "@/lib/admin-status";
import { formatDateTime, telLink, whatsappLink } from "@/lib/admin-helpers";
import { deleteApplication, updateApplication } from "../actions";

export const metadata = { title: "Worker application" };

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sb = await createClient();

  const { data: a } = await sb.from("worker_applications").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();

  const { data: imageRows } = await sb
    .from("worker_application_images")
    .select("id, storage_path")
    .eq("application_id", id)
    .order("created_at");
  const images = (imageRows ?? []) as { id: string; storage_path: string }[];
  const urls = await signedUrlsFor(images.map((i) => i.storage_path));
  const photos = images.flatMap((i) => {
    const url = urls.get(i.storage_path);
    return url ? [{ id: i.id, url }] : [];
  });

  const update = updateApplication.bind(null, id);
  const del = deleteApplication.bind(null, id);

  return (
    <div>
      <Link href="/admin/applications" className="text-sm text-stone hover:text-charcoal">
        ← All applications
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-charcoal">{a.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-stone">
            <span>{a.role_title}</span>
            <Badge tone={applicationTone(a.status)}>{APPLICATION_STATUS_LABELS[a.status] ?? a.status}</Badge>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={telLink(a.phone)}>Call</a>
          </Button>
          <Button asChild variant="whatsapp">
            <a href={whatsappLink(a.phone)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="details">
        <h2 id="details" className="mb-3 text-2xl text-charcoal">
          Details
        </h2>
        <DetailList
          items={[
            { label: "Applied", value: formatDateTime(a.created_at) },
            { label: "Phone", value: a.phone },
            { label: "Role", value: a.role_title },
            { label: "Location", value: a.location },
            {
              label: "Experience",
              value: a.experience_years !== null ? `${Number(a.experience_years)} years` : null,
            },
            { label: "Skills", value: a.skills },
            { label: "Expected salary", value: a.expected_salary },
            { label: "Availability", value: a.availability },
            { label: "Introduction", value: a.introduction },
          ]}
        />
        {photos.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg text-charcoal">Work photos</h3>
            <PhotoGrid photos={photos} />
          </div>
        ) : null}
      </section>

      <section className="mt-10" aria-labelledby="manage">
        <h2 id="manage" className="mb-3 text-2xl text-charcoal">
          Status and notes
        </h2>
        <StatusNotesForm
          statuses={optionsFrom(APPLICATION_STATUSES, APPLICATION_STATUS_LABELS)}
          values={{ status: a.status, admin_notes: a.admin_notes ?? "", follow_up_on: "" }}
          action={update}
        />
      </section>

      <section className="mt-12 border-t border-line pt-6">
        <h2 className="text-lg text-charcoal">Delete this application</h2>
        <p className="mt-1 max-w-xl text-sm text-stone">Removes the application and the uploaded photos.</p>
        <form action={del} className="mt-3">
          <DeleteButton confirm={`Delete the application from ${a.name}? This cannot be undone.`} />
        </form>
      </section>
    </div>
  );
}
