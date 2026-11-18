import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProjectCaseCard } from "@/components/shared/project-case-card";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Completed Projects | POP & PVC Interior Case Studies",
  description: "Explore completed POP false ceiling, gypsum, and PVC wall panel projects across Bayad, Modasa, Himatnagar, and Gujarat.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getBusinessSettings(), getProjects()]);

  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <>
      {/* Luxury Dark Header */}
      <section className="relative overflow-hidden bg-[#161514] py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_60%)]"
        />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Architectural Portfolio
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Completed <span className="text-[#d4af37]">Case Studies</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Real POP ceilings, LED cove lighting, and waterproof PVC wall transformations delivered on schedule across Gujarat.
          </p>
        </Container>
      </section>

      {/* Story-Driven Case Study Grid with Staggered Scroll Reveal */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          {projects.failed ? (
            <ErrorState />
          ) : projects.data.length === 0 ? (
            <EmptyState
              title="Project case studies coming soon"
              description="We are uploading photos and specifications of our recent POP and PVC installations."
            />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.data.map((project, idx) => (
                <ScrollReveal key={project.id} delayMs={(idx % 3) * 120}>
                  <ProjectCaseCard project={project} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Bottom Studio CTA */}
          <ScrollReveal delayMs={150} className="mt-16">
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#EAE4D9] bg-[#161514] p-8 text-center text-white sm:flex-row sm:text-left sm:p-10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37]">
                  Start Your Transformation
                </span>
                <h2 className="mt-1.5 font-sans text-2xl font-extrabold text-white sm:text-3xl">
                  Want similar finishing for your home or showroom?
                </h2>
                <p className="mt-1.5 text-sm text-white/75">
                  Book a free site visit in Bayad, Modasa, Himatnagar, or nearby towns.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-charcoal transition hover:bg-[#c5a028]"
                >
                  Get Free Quote
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1fb874] px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#199e63]"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
