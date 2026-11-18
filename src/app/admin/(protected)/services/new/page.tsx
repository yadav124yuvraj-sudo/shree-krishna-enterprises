import { requireAdmin } from "@/lib/auth";
import { createService } from "../actions";
import { ServiceForm } from "../service-form";

export const metadata = { title: "Add service" };

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-3xl text-charcoal">Add service</h1>
      <div className="mt-8">
        <ServiceForm
          values={{ title: "", short_description: "", description: "", is_published: false, sort_order: 0, cover_image_url: null }}
          action={createService}
          submitLabel="Create service"
        />
      </div>
    </div>
  );
}
