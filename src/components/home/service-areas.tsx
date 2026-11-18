import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/states/empty-state";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export type ServiceAreaItem = {
  id: string;
  name: string;
};

interface ServiceAreasProps {
  serviceAreas: ServiceAreaItem[];
  fallbackAddress?: string;
  whatsappNumber: string;
}

export function ServiceAreas({
  serviceAreas,
  fallbackAddress,
  whatsappNumber,
}: ServiceAreasProps) {
  return (
    <Section id="service-areas">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
          Coverage
        </span>
        <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">Areas We Serve</h2>
        <p className="mt-3 text-stone">
          We provide on-site false ceiling and PVC installation services across local and neighboring regions.
        </p>
      </div>

      <div className="mt-8">
        {serviceAreas.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2.5">
              {serviceAreas.map((area) => (
                <div
                  key={area.id}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-line bg-beige/40 px-3.5 py-2 text-sm text-charcoal shadow-2xs"
                >
                  <MapPin className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                  <span>{area.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-stone">
              Have a project in an adjacent area? Contact us directly to confirm availability.
            </p>
          </>
        ) : (
          <EmptyState
            title="Service coverage being updated"
            description={
              fallbackAddress
                ? `Currently operating in and around ${fallbackAddress}. Reach out on WhatsApp with your location to confirm service availability.`
                : "We provide on-site false ceiling and PVC installation services. Reach out on WhatsApp with your location to confirm availability."
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="whatsapp">
                  <a
                    href={buildWhatsAppLink({
                      whatsappNumber,
                      message: buildEnquiryMessage({ kind: "general" }),
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                    Check Location on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Page</Link>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </Section>
  );
}
