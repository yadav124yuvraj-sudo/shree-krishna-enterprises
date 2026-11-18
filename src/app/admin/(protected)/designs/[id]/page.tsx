import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { publicMediaUrl } from "@/lib/storage";
import { DeleteButton } from "@/components/admin/delete-button";
import { addDesignImage, deleteDesign, deleteDesignImage, updateDesign } from "../actions";
import { DesignForm } from "../design-form";
import { DesignImages } from "../design-images";

export const metadata = { title: "Edit design" };

export default async function EditDesignPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sb = await createClient();
  const [{ data: design }, { data: services }, { data: categories }, { data: links }, { data: images }] = await Promise.all([
    sb.from("designs").select("title, description, service_id, is_published, is_featured, cover_image_path").eq("id", id).maybeSingle(),
    sb.from("services").select("id, title").order("sort_order"),
    sb.from("design_categories").select("id, slug, name, kind").order("sort_order"),
    sb.from("design_category_links").select("category_id").eq("design_id", id),
    sb.from("design_images").select("id, storage_path").eq("design_id", id).order("sort_order"),
  ]);
  if (!design) notFound();

  const update = updateDesign.bind(null, id);
  const del = deleteDesign.bind(null, id);
  const addImage = addDesignImage.bind(null, id);
  const deleteImage = deleteDesignImage.bind(null, id);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl text-charcoal">Edit design</h1>
          <form action={del}>
            <DeleteButton confirm={`Delete "${design.title}" and all its photos? This cannot be undone.`} />
          </form>
        </div>
        <div className="mt-8">
          <DesignForm
            values={{
              title: design.title,
              description: design.description ?? "",
              service_id: design.service_id ?? "",
              is_published: design.is_published,
              is_featured: design.is_featured,
              category_ids: (links ?? []).map((l) => l.category_id),
              cover_image_url: publicMediaUrl(design.cover_image_path),
            }}
            services={services ?? []}
            categories={categories ?? []}
            action={update}
            submitLabel="Save changes"
          />
        </div>
      </div>

      <DesignImages
        images={(images ?? []).map((i) => ({ id: i.id, url: publicMediaUrl(i.storage_path) ?? "" }))}
        addAction={addImage}
        deleteAction={deleteImage}
      />
    </div>
  );
}
