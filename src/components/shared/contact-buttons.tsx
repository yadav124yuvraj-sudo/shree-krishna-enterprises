import { MessageCircle, Phone } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { telHref, type BusinessSettings } from "@/lib/business-settings";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

/** WhatsApp button with a prefilled message containing the item name and its full link. */
export function WhatsAppLink({
  settings,
  kind = "general",
  itemName,
  path,
  label = "WhatsApp",
  variant = "whatsapp",
  size,
}: {
  settings: BusinessSettings;
  kind?: "design" | "project" | "service" | "general";
  itemName?: string;
  path?: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const href = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({
      kind,
      itemName,
      url: path ? `${settings.siteUrl}${path}` : undefined,
    }),
  });
  return (
    <Button asChild variant={variant} size={size}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}

/** Click-to-call button. Renders nothing until a real phone number is set. */
export function CallLink({
  settings,
  variant = "outline",
  size,
}: {
  settings: BusinessSettings;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const href = telHref(settings);
  if (!href) return null;
  return (
    <Button asChild variant={variant} size={size}>
      <a href={href}>
        <Phone aria-hidden="true" />
        Call us
      </a>
    </Button>
  );
}
