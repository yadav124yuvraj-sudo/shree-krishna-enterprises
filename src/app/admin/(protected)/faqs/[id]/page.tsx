import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaq, updateFaq } from "../actions";
import { FaqForm } from "../faq-form";

export const metadata = { title: "Edit FAQ" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sb = await createClient();
  const { data } = await sb
    .from("faqs")
    .select("question, answer, is_published, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const update = updateFaq.bind(null, id);
  const del = deleteFaq.bind(null, id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-charcoal">Edit FAQ</h1>
        <form action={del}>
          <DeleteButton confirm="Delete this FAQ? This cannot be undone." />
        </form>
      </div>
      <div className="mt-8">
        <FaqForm
          values={{
            question: data.question,
            answer: data.answer,
            is_published: data.is_published,
            sort_order: data.sort_order,
          }}
          action={update}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
