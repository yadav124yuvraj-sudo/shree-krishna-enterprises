import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CallLink, WhatsAppLink } from "@/components/shared/contact-buttons";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getBusinessSettings } from "@/lib/business-settings";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { submitQuote } from "./actions";

export const metadata = pageMetadata({
  title: "Get a Free Quotation",
  description: "Ask Shree Krishna Enterprises for a quotation for POP or PVC work.",
  path: "/quote",
});

export default async function QuotePage() {
  const [settings, services] = await Promise.all([getBusinessSettings(), getServices()]);

  return (
    <>
      <PageHeader
        title="Get a Free Quotation"
        description="Tell us about your room and we will prepare a quotation after reviewing your requirements."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <EnquiryForm
            mode="quote"
            services={services.data.map((s) => s.title)}
            design={null}
            action={submitQuote}
            whatsappNumber={settings.whatsappNumber}
          />
          <aside className="space-y-6 lg:pt-2">
            <div>
              <h2 className="text-2xl text-charcoal">Prefer to talk?</h2>
              <p className="mt-2 text-stone">Send us the room size, the work you want and a few photos.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <WhatsAppLink settings={settings} label="WhatsApp us" />
                <CallLink settings={settings} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-charcoal">What happens next</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-stone">
                <li>We read your request and look at your photos.</li>
                <li>We contact you to understand the work, and may visit the site if needed.</li>
                <li>We give the final quotation after reviewing your requirements.</li>
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
