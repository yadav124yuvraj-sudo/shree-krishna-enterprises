import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { publicMediaUrl } from "@/lib/storage";
import { DeleteButton } from "@/components/admin/delete-button";
import { addProjectImage, deleteProject, deleteProjectImage, updateProject } from "../actions";
import { ProjectForm } from "../project-form";
import { ProjectImages } from "../project-images";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sb = await createClient();
  const [{ data: project }, { data: services }, { data: images }] = await Promise.all([
    sb
      .from("projects")
      .select("title, location, description, completed_on, video_url, service_id, is_published, is_featured")
      .eq("id", id)
      .maybeSingle(),
    sb.from("services").select("id, title").order("sort_order"),
    sb.from("project_images").select("id, storage_path, kind, alt_text").eq("project_id", id).order("sort_order"),
  ]);
  if (!project) notFound();

  const update = updateProject.bind(null, id);
  const del = deleteProject.bind(null, id);
  const addImage = addProjectImage.bind(null, id);
  const deleteImage = deleteProjectImage.bind(null, id);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl text-charcoal">Edit project</h1>
          <form action={del}>
            <DeleteButton confirm={`Delete "${project.title}" and all its photos? This cannot be undone.`} />
          </form>
        </div>
        <div className="mt-8">
          <ProjectForm
            values={{
              title: project.title,
              location: project.location ?? "",
              description: project.description ?? "",
              completed_on: project.completed_on ?? "",
              video_url: project.video_url ?? "",
              service_id: project.service_id ?? "",
              is_published: project.is_published,
              is_featured: project.is_featured,
            }}
            services={services ?? []}
            action={update}
            submitLabel="Save changes"
          />
        </div>
      </div>

      <ProjectImages
        images={(images ?? []).map((i) => ({
          id: i.id,
          url: publicMediaUrl(i.storage_path) ?? "",
          kind: i.kind,
          alt_text: i.alt_text,
        }))}
        addAction={addImage}
        deleteAction={deleteImage}
      />
    </div>
  );
}
