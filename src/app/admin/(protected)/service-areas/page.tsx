import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/states/empty-state";
import { AreaForm } from "./area-form";
import { createServiceArea, deleteServiceArea, updateServiceArea } from "./actions";

export const metadata = { title: "Service areas" };

export default async function AdminServiceAreasPage() {
  await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb
    .from("service_areas")
    .select("id, name, is_active, sort_order")
    .order("sort_order")
    .order("name");

  return (
    <div>
      <h1 className="text-3xl text-charcoal">Service areas</h1>
      <p className="mt-2 max-w-2xl text-stone">
        The cities and areas where you really work. Only areas marked &quot;Shown&quot; appear on the website.
      </p>

      <section className="mt-8 rounded-sm border border-line bg-beige/40 p-5" aria-labelledby="add-area">
        <h2 id="add-area" className="mb-3 text-xl text-charcoal">
          Add an area
        </h2>
        <AreaForm
          idPrefix="new"
          values={{ name: "", sort_order: 0, is_active: true }}
          action={createServiceArea}
          submitLabel="Add area"
          resetOnSuccess
        />
      </section>

      <div className="mt-8">
        {error ? (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            Could not load service areas.
          </p>
        ) : !data || data.length === 0 ? (
          <EmptyState title="No service areas yet" description="Add the first area above." />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {data.map((a) => (
              <li key={a.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                <AreaForm
                  idPrefix={a.id}
                  values={{ name: a.name, sort_order: a.sort_order, is_active: a.is_active }}
                  action={updateServiceArea.bind(null, a.id)}
                  submitLabel="Save"
                />
                <form action={deleteServiceArea.bind(null, a.id)}>
                  <DeleteButton confirm={`Remove "${a.name}" from the list?`} label="Remove" />
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
