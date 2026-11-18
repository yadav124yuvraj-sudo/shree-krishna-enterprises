import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getFaqs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "FAQ",
  description: "Frequently asked questions about POP and PVC work.",
  path: "/faq",
});

export default async function FaqPage() {
  const settings = await getBusinessSettings();
  if (!settings.features.faq) notFound();
  const faqs = await getFaqs();
  return (
    <>
      <PageHeader title="Frequently asked questions" />
      <Section>
        {faqs.failed ? (
          <ErrorState />
        ) : faqs.data.length === 0 ? (
          <EmptyState title="No questions added yet" />
        ) : (
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {faqs.data.map((f) => (
              <details key={f.id} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-charcoal">
                  {f.question}
                  <span aria-hidden="true" className="text-gold-deep group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-stone">{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
