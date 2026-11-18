import Link from "next/link";
import { ArrowRight, Layers, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/states/empty-state";
import { getPublicMediaUrl } from "@/lib/supabase/public";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export type FeaturedProject = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  description: string | null;
  serviceType: string | null;
  coverImagePath: string | null;
  coverImageAlt: string | null;
};

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
  whatsappNumber: string;
  siteUrl: string;
}

export function FeaturedProjects({
  projects,
  whatsappNumber,
  siteUrl,
}: FeaturedProjectsProps) {
  return (
    <Section id="projects">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
            Our Work
          </span>
          <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">Featured Projects</h2>
          <p className="mt-3 max-w-2xl text-stone">
            Real false ceiling and paneling installations completed for residential and commercial spaces.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/projects">
            View all projects
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="mt-10">
        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const imageUrl = getPublicMediaUrl(project.coverImagePath);

              return (
                <Card
                  key={project.id}
                  className="flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md"
                >
                  <div>
                    {imageUrl ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-beige">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={project.coverImageAlt || project.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        {project.serviceType ? (
                          <span className="absolute top-3 left-3 rounded-xs bg-charcoal/85 px-2.5 py-1 text-xs font-medium text-warm-white backdrop-blur-xs">
                            {project.serviceType}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-beige/60 text-stone">
                        <Layers className="size-10 text-stone/40" aria-hidden="true" />
                        {project.serviceType ? (
                          <span className="absolute top-3 left-3 rounded-xs bg-charcoal/85 px-2.5 py-1 text-xs font-medium text-warm-white backdrop-blur-xs">
                            {project.serviceType}
                          </span>
                        ) : null}
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="font-serif text-xl leading-snug">
                          {project.title}
                        </CardTitle>
                        {project.location ? (
                          <span className="flex shrink-0 items-center gap-1 text-xs text-stone">
                            <MapPin className="size-3 text-gold-deep shrink-0" aria-hidden="true" />
                            <span>{project.location}</span>
                          </span>
                        ) : null}
                      </div>
                      {project.description ? (
                        <CardDescription className="mt-2 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      ) : null}
                    </CardHeader>
                  </div>

                  <CardContent className="pt-0">
                    <a
                      href={buildWhatsAppLink({
                        whatsappNumber,
                        message: buildEnquiryMessage({
                          kind: "project",
                          itemName: project.title,
                          url: siteUrl ? `${siteUrl}/projects` : undefined,
                        }),
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-whatsapp-deep hover:underline"
                    >
                      <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                      <span>Inquire about this style</span>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Recent installations being documented"
            description="We photograph and document verified work directly from local sites. You can request direct portfolio photos or share your room dimensions on WhatsApp."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/quote">Request Free Quote</Link>
                </Button>
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
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </Section>
  );
}
