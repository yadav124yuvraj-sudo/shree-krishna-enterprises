import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";

export type LegalSection = { heading: string; paragraphs: string[] };

/** Layout for Privacy and Terms. The owner must review the text before launch. */
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader title={title} description={intro} />
      <Section>
        <div className="max-w-3xl">
          <p className="rounded-sm border border-dashed border-gold bg-beige/50 px-4 py-3 text-stone">
            Draft for the owner to review before launch. Replace anything that does not match how the business
            really works, and have it checked by a professional if needed.
          </p>
          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-2xl text-charcoal">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-stone">{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
