import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

interface ContactCtaProps {
  phoneDisplay?: string;
  phoneTel?: string;
  whatsappNumber: string;
}

export function ContactCta({
  phoneDisplay,
  phoneTel,
  whatsappNumber,
}: ContactCtaProps) {
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <Section tone="charcoal" id="contact-cta">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl text-warm-white sm:text-4xl lg:text-5xl">
          Ready to upgrade your ceilings and walls?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-warm-white/80 sm:text-lg">
          Tell us about your room size and style preference. We will review your details and prepare a free estimate.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg" variant="gold" className="w-full sm:w-auto">
            <Link href="/quote">Get Free Quote</Link>
          </Button>

          {phoneTel ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-warm-white/40 text-warm-white hover:bg-warm-white hover:text-charcoal sm:w-auto"
            >
              <a href={`tel:${phoneTel}`}>
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span>Call {phoneDisplay || phoneTel}</span>
              </a>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-warm-white/40 text-warm-white hover:bg-warm-white hover:text-charcoal sm:w-auto"
            >
              <Link href="/contact">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span>Call Us</span>
              </Link>
            </Button>
          )}

          <Button asChild size="lg" variant="whatsapp" className="w-full sm:w-auto">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
