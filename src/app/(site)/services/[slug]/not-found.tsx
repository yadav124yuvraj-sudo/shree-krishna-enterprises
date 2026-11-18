import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/states/empty-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export default async function ServiceNotFound() {
  const settings = await getBusinessSettings();
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <EmptyState
          title="Service Not Found"
          description="The service you are looking for does not exist or may not have been published yet. You can explore all our currently available services or ask us directly on WhatsApp."
          action={
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/services">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  View All Services
                </Link>
              </Button>
              <Button asChild variant="whatsapp">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          }
        />
      </div>
    </Container>
  );
}
