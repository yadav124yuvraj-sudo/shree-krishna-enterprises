import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { publicMediaUrl } from "@/lib/storage";
import { updateService, deleteService } from "../actions";
import { ServiceForm } from "../service-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sb = await createClient();
  const { data } = await sb
    .from("services")
    .select("title, short_description, description, is_published, sort_order, cover_image_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const update = updateService.bind(null, id);
  const del = deleteService.bind(null, id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-charcoal">Edit service</h1>
        <form action={del}>
          <DeleteButton confirm={`Delete "${data.title}"? This cannot be undone.`} />
        </form>
      </div>
      <div className="mt-8">
        <ServiceForm
          values={{
            title: data.title,
            short_description: data.short_description ?? "",
            description: data.description ?? "",
            is_published: data.is_published,
            sort_order: data.sort_order,
            cover_image_url: publicMediaUrl(data.cover_image_path),
          }}
          action={update}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
