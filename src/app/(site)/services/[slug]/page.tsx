import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { ItemImage } from "@/components/shared/item-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { DesignCard, ProjectCard } from "@/components/shared/cards";
import { CallLink, WhatsAppLink } from "@/components/shared/contact-buttons";
import { getBusinessSettings } from "@/lib/business-settings";
import { getDesigns, getProjects, getService } from "@/lib/content";
import { publicMediaUrl } from "@/lib/storage";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await getService(slug);
  if (!service) return { title: "Service not found" };
  return pageMetadata({
    title: service.title,
    description: service.short_description ?? `${service.title} by Shree Krishna Enterprises.`,
    path: `/services/${service.slug}`,
    image: publicMediaUrl(service.cover_image_path),
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, service] = await Promise.all([getBusinessSettings(), getService(slug)]);
  if (!service.data) notFound();
  const s = service.data;

  const [designs, projects] = await Promise.all([getDesigns(), getProjects()]);
  const relatedDesigns = designs.data.filter((d) => d.service_id === s.id).slice(0, 3);
  const relatedProjects = projects.data.filter((p) => p.service_id === s.id).slice(0, 3);

  return (
    <>
      <Section>
        <Link href="/services" className="text-stone underline hover:text-charcoal">
          All services
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl text-charcoal sm:text-5xl">{s.title}</h1>
            {s.short_description ? <p className="mt-4 text-lg text-stone">{s.short_description}</p> : null}
            {s.description ? (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-charcoal">{s.description}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/quote">Get Free Quote</Link>
              </Button>
              <WhatsAppLink
                settings={settings}
                kind="service"
                itemName={s.title}
                path={`/services/${s.slug}`}
                size="lg"
              />
              <CallLink settings={settings} size="lg" />
            </div>
          </div>
          {s.cover_image_path ? (
            <ItemImage path={s.cover_image_path} alt={s.title} className="aspect-[4/3]" priority />
          ) : null}
        </div>
      </Section>

      {relatedDesigns.length > 0 ? (
        <Section tone="beige">
          <SectionHeading title={`${s.title} designs`} />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedDesigns.map((d) => (
              <DesignCard key={d.id} design={d} showFavourite={settings.features.favourites} />
            ))}
          </div>
        </Section>
      ) : null}

      {relatedProjects.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Our work" title={`${s.title} projects`} />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
