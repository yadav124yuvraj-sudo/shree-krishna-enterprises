import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createDesign } from "../actions";
import { DesignForm } from "../design-form";

export const metadata = { title: "Add design" };

export default async function NewDesignPage() {
  await requireAdmin();
  const sb = await createClient();
  const [{ data: services }, { data: categories }] = await Promise.all([
    sb.from("services").select("id, title").order("sort_order"),
    sb.from("design_categories").select("id, slug, name, kind").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Add design</h1>
      <p className="mt-2 max-w-2xl text-stone">Save the design first, then add more photos on the next screen.</p>
      <div className="mt-8">
        <DesignForm
          values={{ title: "", description: "", service_id: "", is_published: false, is_featured: false, category_ids: [], cover_image_url: null }}
          services={services ?? []}
          categories={categories ?? []}
          action={createDesign}
          submitLabel="Create design"
        />
      </div>
    </div>
  );
}
