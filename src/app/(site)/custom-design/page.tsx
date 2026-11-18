import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CallLink, WhatsAppLink } from "@/components/shared/contact-buttons";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getBusinessSettings } from "@/lib/business-settings";
import { getDesign, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { submitCustomDesign } from "./actions";

export const metadata = pageMetadata({
  title: "Custom Design Request",
  description: "Tell us the room and style you want and we will suggest a POP or PVC design.",
  path: "/custom-design",
});

export default async function CustomDesignPage({
  searchParams,
}: {
  searchParams: Promise<{ design?: string }>;
}) {
  const { design: designSlug } = await searchParams;
  const [settings, services, designResult] = await Promise.all([
    getBusinessSettings(),
    getServices(),
    designSlug ? getDesign(designSlug) : Promise.resolve({ data: null, failed: false }),
  ]);
  const design = designResult.data ? { slug: designResult.data.slug, title: designResult.data.title } : null;

  return (
    <>
      <PageHeader
        title="Custom Design Request"
        description="Tell us the room, the style and the size, and we will suggest a design."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <EnquiryForm
            mode="custom"
            services={services.data.map((s) => s.title)}
            design={design}
            action={submitCustomDesign}
            whatsappNumber={settings.whatsappNumber}
          />
          <aside className="space-y-6 lg:pt-2">
            <div>
              <h2 className="text-2xl text-charcoal">Prefer to talk?</h2>
              <p className="mt-2 text-stone">Send us the room type, size, the style you like and photos.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <WhatsAppLink settings={settings} label="WhatsApp us" />
                <CallLink settings={settings} />
              </div>
            </div>
            <p className="text-sm text-stone">
              Final price depends on the site, material and labour. We give a quotation after reviewing your
              requirements.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
