import { requireAdmin } from "@/lib/auth";
import { createFaq } from "../actions";
import { FaqForm } from "../faq-form";

export const metadata = { title: "Add FAQ" };

export default async function NewFaqPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-3xl text-charcoal">Add FAQ</h1>
      <div className="mt-8">
        <FaqForm
          values={{ question: "", answer: "", is_published: false, sort_order: 0 }}
          action={createFaq}
          submitLabel="Create FAQ"
        />
      </div>
    </div>
  );
}
