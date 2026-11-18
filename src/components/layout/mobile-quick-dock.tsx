import { getBusinessSettings, telHref } from "@/lib/business-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MobileQuickDockClient } from "./mobile-quick-dock-client";

export async function MobileQuickDock() {
  const settings = await getBusinessSettings();

  const phoneLink = telHref(settings) || "tel:+919428523958";
  const whatsappLink = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: `Hello ${settings.name}, I saw your website and want to enquire about POP / PVC ceiling work.`,
  });

  return <MobileQuickDockClient phoneLink={phoneLink} whatsappLink={whatsappLink} />;
}
