import Link from "next/link";
import { LayoutGrid, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/shared/cards";
import { WhatsAppLink } from "@/components/shared/contact-buttons";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Our Projects | Completed POP & PVC False Ceiling Work",
  description: "Completed POP and PVC interior projects by Shree Krishna Enterprises.",
  path: "/projects",
});

const chip =
  "inline-flex h-10 items-center rounded-full border px-5 text-xs font-bold uppercase tracking-wider transition-all";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const [settings, projects] = await Promise.all([getBusinessSettings(), getProjects()]);

  const services = new Map<string, string>();
  for (const p of projects.data) if (p.services) services.set(p.services.slug, p.services.title);

  const shown = service ? projects.data.filter((p) => p.services?.slug === service) : projects.data;
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <>
      {/* 1. LUXURY DARK HEADER BANNER */}
      <section className="relative overflow-hidden bg-[#161514] py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_60%)]"
        />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <LayoutGrid className="size-3.5" aria-hidden="true" />
            Our Portfolio
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Our Completed Projects
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Explore real POP false ceilings, LED cove lighting designs, and PVC wall paneling completed across homes, offices, and showrooms.
          </p>
        </Container>
      </section>

      {/* 2. 4-COLUMN OVERLAY GALLERY SECTION */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          {projects.failed ? (
            <ErrorState />
          ) : projects.data.length === 0 ? (
            <EmptyState
              title="Projects will appear here soon"
              description="We are adding photos of our completed work. Message us and we can share examples on WhatsApp."
              action={<WhatsAppLink settings={settings} />}
            />
          ) : (
            <>
              {services.size > 1 ? (
                <nav
                  aria-label="Filter by service"
                  className="mb-10 flex flex-wrap items-center justify-center gap-2.5"
                >
                  <Link
                    href="/projects"
                    aria-current={!service ? "true" : undefined}
                    className={cn(
                      chip,
                      !service
                        ? "border-charcoal bg-charcoal text-[#d4af37] shadow-sm"
                        : "border-[#DFD5C5] bg-white text-charcoal hover:border-charcoal",
                    )}
                  >
                    All Projects
                  </Link>
                  {[...services].map(([slug, title]) => (
                    <Link
                      key={slug}
                      href={`/projects?service=${encodeURIComponent(slug)}`}
                      aria-current={service === slug ? "true" : undefined}
                      className={cn(
                        chip,
                        service === slug
                          ? "border-charcoal bg-charcoal text-[#d4af37] shadow-sm"
                          : "border-[#DFD5C5] bg-white text-charcoal hover:border-charcoal",
                      )}
                    >
                      {title}
                    </Link>
                  ))}
                </nav>
              ) : null}

              {shown.length === 0 ? (
                <EmptyState title="No projects in this category yet" />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {shown.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* 3. BOTTOM CTA */}
      <section className="bg-[#161514] py-16 text-white">
        <Container className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-sans text-2xl font-extrabold text-white sm:text-3xl">
              Want a similar ceiling or wall design for your space?
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Send us your room size or reference photo for a free estimate and site visit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 text-sm font-bold text-charcoal transition hover:bg-[#c5a028]"
            >
              Get Free Quote
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1fb874] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#199e63]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
