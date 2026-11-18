import { MobileQuickDock } from "@/components/layout/mobile-quick-dock";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { BrandPreloader } from "@/components/layout/brand-preloader";
import { getBusinessSettings } from "@/lib/business-settings";
import { getFaqs } from "@/lib/content";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBusinessSettings();
  const showFaq = settings.features.faq && (await getFaqs()).data.length > 0;
  const showPlaceholderNotice =
    settings.usingPlaceholders && process.env.NODE_ENV !== "production";

  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <>
      <BrandPreloader businessName={settings.name} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-warm-white"
      >
        Skip to content
      </a>
      {showPlaceholderNotice ? (
        <p className="bg-gold px-4 py-2 text-center text-sm text-charcoal">
          Setup mode: phone, WhatsApp and email are placeholders. Add them in the
          admin settings (or .env.local).
        </p>
      ) : null}
      <SiteHeader name={settings.name} whatsappHref={whatsappHref} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} showFaq={showFaq} />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        siteUrl={settings.siteUrl}
      />
    </>
  );
}
