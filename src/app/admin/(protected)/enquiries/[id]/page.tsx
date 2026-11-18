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
import { NotifyWhatsapp } from "@/components/admin/notify-whatsapp";
import {
  ENQUIRY_KIND_LABELS,
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  enquiryTone,
  optionsFrom,
} from "@/lib/admin-status";
import { formatDate, formatDateTime, telLink, whatsappLink } from "@/lib/admin-helpers";
import { getBusinessSettings } from "@/lib/business-settings";
import { deleteEnquiry, updateEnquiry } from "../actions";

export const metadata = { title: "Enquiry" };

type History = { id: string; from_status: string | null; to_status: string; created_at: string };

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [sb, settings] = await Promise.all([createClient(), getBusinessSettings()]);

  const { data: e } = await sb
    .from("enquiries")
    .select("*, designs(title), projects(title)")
    .eq("id", id)
    .maybeSingle();
  if (!e) notFound();

  const [{ data: imageRows }, { data: historyRows }] = await Promise.all([
    sb.from("enquiry_images").select("id, storage_path").eq("enquiry_id", id).order("created_at"),
    sb
      .from("enquiry_status_history")
      .select("id, from_status, to_status, created_at")
      .eq("enquiry_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const images = (imageRows ?? []) as { id: string; storage_path: string }[];
  const urls = await signedUrlsFor(images.map((i) => i.storage_path));
  const photos = images.flatMap((i) => {
    const url = urls.get(i.storage_path);
    return url ? [{ id: i.id, url }] : [];
  });
  const history = (historyRows ?? []) as History[];

  const size = e.length_ft && e.width_ft ? `${Number(e.length_ft)} ft × ${Number(e.width_ft)} ft` : null;
  const update = updateEnquiry.bind(null, id);
  const del = deleteEnquiry.bind(null, id);

  return (
    <div>
      <Link href="/admin/enquiries" className="text-sm text-stone hover:text-charcoal">
        ← All enquiries
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-charcoal">{e.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-stone">
            <span>{e.ref_code}</span>
            <Badge tone="neutral">{ENQUIRY_KIND_LABELS[e.kind] ?? e.kind}</Badge>
            <Badge tone={enquiryTone(e.status)}>{ENQUIRY_STATUS_LABELS[e.status] ?? e.status}</Badge>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={telLink(e.phone)}>Call</a>
          </Button>
          <Button asChild variant="whatsapp">
            <a href={whatsappLink(e.phone)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          {e.email ? (
            <Button asChild variant="outline">
              <a href={`mailto:${e.email}`}>Email</a>
            </Button>
          ) : null}
        </div>
      </div>

      <section className="mt-8" aria-labelledby="details">
        <h2 id="details" className="mb-3 text-2xl text-charcoal">
          Details
        </h2>
        <DetailList
          items={[
            { label: "Received", value: formatDateTime(e.created_at) },
            { label: "Phone", value: e.phone },
            { label: "Email", value: e.email },
            { label: "Address", value: e.address },
            { label: "Service", value: e.service_type },
            { label: "Room", value: e.room_type },
            { label: "Size", value: size },
            { label: "Budget", value: e.budget_range },
            { label: "Style", value: e.style },
            { label: "Preferred visit date", value: formatDate(e.preferred_visit_date) },
            { label: "Preferred location", value: e.preferred_location },
            {
              label: "Design",
              value: e.designs?.title ? (
                <Link href={`/admin/designs/${e.design_id}`} className="underline hover:text-gold-deep">
                  {e.designs.title}
                </Link>
              ) : null,
            },
            {
              label: "Project",
              value: e.projects?.title ? (
                <Link href={`/admin/projects/${e.project_id}`} className="underline hover:text-gold-deep">
                  {e.projects.title}
                </Link>
              ) : null,
            },
            { label: "Message", value: e.description },
          ]}
        />
        {photos.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg text-charcoal">Photos from the customer</h3>
            <PhotoGrid photos={photos} />
          </div>
        ) : null}
      </section>

      <section className="mt-10" aria-labelledby="manage">
        <h2 id="manage" className="mb-3 text-2xl text-charcoal">
          Status and notes
        </h2>
        <StatusNotesForm
          statuses={optionsFrom(ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS)}
          values={{
            status: e.status,
            admin_notes: e.admin_notes ?? "",
            follow_up_on: e.follow_up_on ?? "",
          }}
          withFollowUp
          action={update}
        />
      </section>

      <section className="mt-10" aria-labelledby="notify">
        <h2 id="notify" className="mb-3 text-2xl text-charcoal">
          Let the customer know
        </h2>
        <NotifyWhatsapp
          phone={e.phone}
          businessName={settings.name}
          currentStatus={e.status}
          enquiry={{
            name: e.name,
            ref_code: e.ref_code,
            service_type: e.service_type,
            preferred_visit_date: e.preferred_visit_date,
          }}
        />
      </section>

      {history.length > 0 ? (
        <section className="mt-10" aria-labelledby="history">
          <h2 id="history" className="mb-3 text-2xl text-charcoal">
            Status history
          </h2>
          <ul className="divide-y divide-line rounded-sm border border-line">
            {history.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                <span className="text-charcoal">
                  {h.from_status ? `${ENQUIRY_STATUS_LABELS[h.from_status] ?? h.from_status} → ` : ""}
                  {ENQUIRY_STATUS_LABELS[h.to_status] ?? h.to_status}
                </span>
                <time dateTime={h.created_at} className="text-stone">
                  {formatDateTime(h.created_at)}
                </time>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 border-t border-line pt-6">
        <h2 className="text-lg text-charcoal">Delete this enquiry</h2>
        <p className="mt-1 max-w-xl text-sm text-stone">
          Removes the enquiry, its history and the customer&apos;s photos. Use this if the customer asks you to delete
          their data.
        </p>
        <form action={del} className="mt-3">
          <DeleteButton confirm={`Delete the enquiry from ${e.name}? This cannot be undone.`} />
        </form>
      </section>
    </div>
  );
}
