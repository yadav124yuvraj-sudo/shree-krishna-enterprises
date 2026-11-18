import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createProject } from "../actions";
import { ProjectForm } from "../project-form";

export const metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data: services } = await sb.from("services").select("id, title").order("sort_order");

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Add project</h1>
      <p className="mt-2 max-w-2xl text-stone">Save the project first, then add photos on the next screen.</p>
      <div className="mt-8">
        <ProjectForm
          values={{ title: "", location: "", description: "", completed_on: "", video_url: "", service_id: "", is_published: false, is_featured: false }}
          services={services ?? []}
          action={createProject}
          submitLabel="Create project"
        />
      </div>
    </div>
  );
}
