"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Floating WhatsApp button shown on every public page.
 * The prefilled message includes the page the visitor is on.
 */
export function FloatingWhatsApp({
  whatsappNumber,
  siteUrl,
}: {
  whatsappNumber: string;
  siteUrl: string;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const message = isHome
    ? buildEnquiryMessage({ kind: "general" })
    : `${buildEnquiryMessage({ kind: "general" })}\nI was looking at: ${siteUrl}${pathname}`;

  return (
    <a
      href={buildWhatsAppLink({ whatsappNumber, message })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp px-5 text-white shadow-lg transition-colors hover:bg-whatsapp-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
      <span className="hidden text-[0.95rem] font-medium sm:inline">WhatsApp</span>
    </a>
  );
}
