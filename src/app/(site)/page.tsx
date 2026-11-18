import { MobileStudioShowcase } from "@/components/home/mobile-studio-showcase";
import Link from "next/link";
import {
  Award,
  Building2,
  ChevronDown,
  Clock,
  Home,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { HeroBackground } from "@/components/home/hero-background";
import { QuickQuoteBox } from "@/components/home/quick-quote-box";
import { ServiceAreasGrid } from "@/components/shared/service-areas-grid";
import { ProjectCard, ServiceCard } from "@/components/shared/cards";
import { JsonLd } from "@/components/shared/json-ld";
import { getBusinessSettings, hasAddress, hasEmail, telHref } from "@/lib/business-settings";
import { getApprovedReviews,
  getProjects, getServiceAreas, getServices } from "@/lib/content";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const steps = [
  { num: "01", title: "Share Your Requirement", text: "Tell us your room size, ceiling or wall style, and share reference photos if you have any." },
  { num: "02", title: "Free Site Measurement", text: "We visit your home, office, or shop to inspect the ceiling height and take exact measurements." },
  { num: "03", title: "3D Design & Clear Quote", text: "We finalize the layout, lighting points, and material grade with a transparent quotation." },
  { num: "04", title: "Clean & Timely Execution", text: "Our skilled artisans complete the POP/PVC installation neatly on the agreed schedule." },
  { num: "05", title: "Quality Check & Handover", text: "We inspect every joint, cove light groove, and finish with you before closing the project." },
];

const reasons = [
  { icon: Award, title: "Direct Owner Supervision", text: "You deal directly with the owner and experienced team—no middlemen or hidden contractor markups." },
  { icon: Sparkles, title: "Premium Material Grade", text: "High-density Gypsum/POP and termite-proof, waterproof PVC panels built for long-lasting finish." },
  { icon: Clock, title: "On-Time Project Delivery", text: "Structured work schedule with clean site management so your family or business isn't disturbed." },
  { icon: ShieldCheck, title: "Transparent Pricing", text: "Detailed quotation provided after site review—no surprise charges once work begins." },
];

export default async function HomePage() {
  const settings = await getBusinessSettings();
  const [services, projects, reviews, areas] = await Promise.all([
    getServices(),
    getProjects(),
    getApprovedReviews(3),
    getServiceAreas(),
  ]);

  const featured = projects.data.filter((p) => p.is_featured).slice(0, 3);
  const phone = telHref(settings);
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  const localBusiness: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.name,
    url: settings.siteUrl,
    description: settings.tagline,
    ...(settings.phoneTel ? { telephone: settings.phoneDisplay } : {}),
    ...(hasEmail(settings) ? { email: settings.email } : {}),
    ...(hasAddress(settings)
      ? { address: { "@type": "PostalAddress", streetAddress: settings.address } }
      : {}),
  };

  return (
    <>
      <JsonLd data={localBusiness} />

      {/* 1. FULL-SCREEN CINEMATIC INTERIOR HERO */}
      <section className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden bg-[#141413] text-white">
        <HeroBackground />

        <Container className="relative z-10 flex flex-col items-center py-16 text-center sm:py-24">
          <h1 className="max-w-4xl font-sans text-4xl font-extrabold leading-[1.12] tracking-tight drop-shadow-md sm:text-6xl lg:text-7xl">
            <span className="block text-[#d4af37]">Expert POP &amp; PVC Solutions</span>
            <span className="mt-1 block text-white">for Every Space.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow sm:text-xl">
            From luxury residential false ceilings to modern PVC wall panels and commercial interiors. Trusted across Bayad &amp; nearby areas.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div>
              <p className="font-sans text-2xl font-extrabold text-[#d4af37] sm:text-3xl">POP &amp; PVC</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/80">Specialists</p>
            </div>
            <div className="h-8 w-px bg-white/25" aria-hidden="true" />
            <div>
              <p className="font-sans text-2xl font-extrabold text-[#d4af37] sm:text-3xl">100%</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/80">Custom Designs</p>
            </div>
            <div className="h-8 w-px bg-white/25" aria-hidden="true" />
            <div>
              <p className="font-sans text-2xl font-extrabold text-[#d4af37] sm:text-3xl">FREE</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/80">Site Measurement</p>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-5 rounded-full border border-white/25 bg-black/50 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md">
            <span className="inline-flex items-center gap-2">
              <Home className="size-4 text-[#d4af37]" aria-hidden="true" />
              Residential
            </span>
            <span className="h-4 w-px bg-white/25" aria-hidden="true" />
            <span className="inline-flex items-center gap-2">
              <Building2 className="size-4 text-[#d4af37]" aria-hidden="true" />
              Commercial
            </span>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#1fb874] px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-[#199e63]"
            >
              <Send className="size-4" aria-hidden="true" />
              Get Free Quote
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-black/55 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-black/75"
            >
              <LayoutGrid className="size-4 text-[#d4af37]" aria-hidden="true" />
              View Our Work
            </Link>

            {phone ? (
              <a
                href={phone}
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold text-charcoal shadow-xl transition hover:bg-warm-white"
              >
                <Phone className="size-4 text-charcoal" aria-hidden="true" />
                {settings.phoneDisplay}
              </a>
            ) : (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold text-charcoal shadow-xl transition hover:bg-warm-white"
              >
                <MessageCircle className="size-4 text-[#1fb874]" aria-hidden="true" />
                Chat on WhatsApp
              </a>
            )}
          </div>

          <a
            href="#services"
            className="mt-12 inline-flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75 transition hover:text-white"
          >
            <span>Scroll</span>
            <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
          </a>
        </Container>
      </section>

      {/* 2. SERVICES SHOWCASE */}
      <section id="services" className="border-t border-white/10 bg-[#181817] py-20 text-white sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Our Expertise
              </span>
              <h2 className="mt-2 font-sans text-3xl font-extrabold text-white sm:text-4xl">
                POP &amp; PVC Interior Solutions
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d4af37] transition hover:bg-[#d4af37] hover:text-charcoal"
            >
              Explore All Services
            </Link>
          </div>

          {services.data.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.data.map((s) => (
                <div
                  key={s.id}
                  className="overflow-hidden rounded-xl border border-white/15 bg-[#1e1e1c] p-4 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 [&_h3]:text-white [&_p]:text-white/75"
                >
                  <ServiceCard service={s} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#222220] p-8 transition hover:border-[#d4af37]/50">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">01 / Ceiling</span>
                <h3 className="mt-3 font-sans text-2xl font-bold text-white">POP False Ceiling &amp; Molding</h3>
                <p className="mt-3 leading-relaxed text-white/75">
                  Designer false ceilings, LED cove light layouts, cornices, and decorative wall moldings in Plaster of Paris.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#222220] p-8 transition hover:border-[#d4af37]/50">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">02 / Panels</span>
                <h3 className="mt-3 font-sans text-2xl font-bold text-white">PVC Wall &amp; Ceiling Panels</h3>
                <p className="mt-3 leading-relaxed text-white/75">
                  Termite-proof, damp-resistant PVC panels, wooden finish louvers, and WPC sheets for modern interiors.
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 3. FEATURED PORTFOLIO PROJECTS (Clean Light Warm Ivory Showcase) */}
      {featured.length > 0 ? (
        <section className="bg-[#FAF8F5] py-20 text-charcoal sm:py-24">
          <Container>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A742E]">
                  Our Portfolio
                </span>
                <h2 className="mt-2 font-sans text-3xl font-extrabold text-charcoal sm:text-4xl">
                  Recently Completed Projects
                </h2>
                <p className="mt-2 max-w-xl text-sm text-stone">
                  Real POP false ceilings and PVC wall paneling completed for homes, offices, and showrooms.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-charcoal/90"
              >
                View Full Gallery
              </Link>
            </div>

            <div
              className={`mt-12 grid gap-8 ${
                featured.length === 1
                  ? "max-w-2xl grid-cols-1"
                  : featured.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="w-full"
                >
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 4. WHY CHOOSE US */}
      <section className="border-t border-white/10 bg-[#181817] py-20 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              Why Choose Us
            </span>
            <h2 className="mt-2 font-sans text-3xl font-extrabold text-white sm:text-4xl">
              Craftsmanship &amp; Reliability You Can Trust
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="rounded-xl border border-white/10 bg-[#1e1e1c] p-6 transition hover:border-[#d4af37]/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-sans text-lg font-bold text-white">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{r.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. 5-STEP PROCESS TIMELINE */}
      <section className="border-t border-white/10 bg-[#141413] py-20 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              How It Works
            </span>
            <h2 className="mt-2 font-sans text-3xl font-extrabold text-white sm:text-4xl">
              Simple 5-Step Process
            </h2>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-5">
            {steps.map((s) => (
              <li
                key={s.num}
                className="relative rounded-xl border border-white/10 bg-[#1e1e1c] p-6 transition hover:border-[#d4af37]/50"
              >
                <span className="inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 font-sans text-xs font-extrabold tracking-wider text-[#d4af37]">
                  STEP {s.num}
                </span>
                <h3 className="mt-4 font-sans text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      {reviews.data.length > 0 ? (
        <section className="border-t border-white/10 bg-[#181817] py-20 text-white sm:py-24">
          <Container>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                  Client Testimonials
                </span>
                <h2 className="mt-2 font-sans text-3xl font-extrabold text-white sm:text-4xl">
                  What Homeowners &amp; Builders Say
                </h2>
              </div>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d4af37] transition hover:bg-[#d4af37] hover:text-charcoal"
              >
                Read All Reviews
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {reviews.data.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#222220] p-6"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#d4af37]" aria-label={`${r.rating} out of 5 stars`}>
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star key={idx} className="size-4 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/85">&ldquo;{r.body}&rdquo;</p>
                  </div>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="font-sans text-sm font-bold text-white">{r.reviewer_name}</p>
                    {r.reviewer_location ? <p className="text-xs text-white/60">{r.reviewer_location}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 7. SERVICE AREAS */}
      

      {/* 8. BOTTOM SPLIT SECTION: QUICK ESTIMATE FORM + DIRECT CTA */}
      <section className="border-t border-white/10 bg-[#181817] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Book a Free Site Visit
            </span>
            <h2 className="mt-4 font-sans text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Ready to Transform Your Ceiling or Walls?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Share your room dimensions, preferred POP/PVC style, or location. We will call you back with design ideas and a clear estimate.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#1fb874] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#199e63]"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Chat on WhatsApp
              </a>
              {phone ? (
                <a
                  href={phone}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-charcoal"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  Call {settings.phoneDisplay}
                </a>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-6">
            <QuickQuoteBox />
          </div>
        </Container>
      </section>
            <ServiceAreasGrid />
    </>
  );
}
