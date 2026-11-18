import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/states/empty-state";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { getPublicMediaUrl } from "@/lib/supabase/public";

export type ServiceSummary = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  cover_image_path: string | null;
};

export function ServicesOverview({
  services,
  whatsappNumber,
  siteUrl,
}: {
  services: ServiceSummary[];
  whatsappNumber: string;
  siteUrl: string;
}) {
  const generalWhatsAppHref = buildWhatsAppLink({
    whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <Section id="services" tone="beige">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
            Capabilities
          </span>
          <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">Our Services</h2>
          <p className="mt-3 max-w-2xl text-stone">
            Specialized false ceiling craftsmanship and wall interior installations for long-lasting finish and elegance.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/services">
            View all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageUrl = getPublicMediaUrl(service.cover_image_path);
            const serviceUrl = `${siteUrl}/services/${service.slug}`;
            const whatsappHref = buildWhatsAppLink({
              whatsappNumber,
              message: buildEnquiryMessage({
                kind: "service",
                itemName: service.title,
                url: serviceUrl,
              }),
            });

            return (
              <Card
                key={service.id}
                className="flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md"
              >
                <div>
                  {imageUrl ? (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-beige">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <Link href={`/services/${service.slug}`} className="hover:text-gold-deep">
                        {service.title}
                      </Link>
                    </CardTitle>
                    {service.short_description ? (
                      <CardDescription className="mt-2 line-clamp-3">
                        {service.short_description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                </div>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-gold-deep"
                    >
                      <span>Explore details</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-whatsapp-deep hover:underline"
                    >
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      <span>Enquire</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="Services are currently being updated"
            description="Our service catalog is being published. We provide custom POP false ceilings, cove profiles, and durable PVC panels."
            action={
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/quote">Request Free Quote</Link>
                </Button>
                <Button asChild variant="whatsapp">
                  <a href={generalWhatsAppHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Enquire on WhatsApp
                  </a>
                </Button>
              </div>
            }
          />
        </div>
      )}
    </Section>
  );
}
