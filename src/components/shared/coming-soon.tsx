import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CallLink, WhatsAppLink } from "@/components/shared/contact-buttons";
import { getBusinessSettings } from "@/lib/business-settings";

/** Holds the place of an online form that is built in a later chapter. */
export async function ComingSoon({
  title,
  description,
  message,
  whatsappText,
}: {
  title: string;
  description: string;
  message: string;
  whatsappText: string;
}) {
  const settings = await getBusinessSettings();
  return (
    <>
      <PageHeader title={title} description={description} />
      <Section>
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-charcoal">{message}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppLink settings={settings} label={whatsappText} size="lg" />
            <CallLink settings={settings} size="lg" />
          </div>
        </div>
      </Section>
    </>
  );
}
