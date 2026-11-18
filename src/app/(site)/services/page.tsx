import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getServices } from "@/lib/content";
import { resolveServiceImage } from "@/lib/service-images";
import { pageMetadata } from "@/lib/seo";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Our Services | POP False Ceiling & PVC Wall Panels",
  description: "Explore our professional POP false ceilings, PVC wall panels, gypsum ceilings, and decorative moldings.",
  path: "/services",
});

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getBusinessSettings(), getServices()]);

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
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_60%)]"
        />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            What We Offer
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Our Interior <span className="text-[#d4af37]">Services</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Precision-crafted POP false ceilings, waterproof PVC wall panels, and architectural moldings installed with clean finishing.
          </p>
        </Container>
      </section>

      {/* 2. 4-COLUMN SERVICE CARDS WITH NAME + AUTO-MATCHED IMAGE */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          {services.failed ? (
            <ErrorState />
          ) : services.data.length === 0 ? (
            <EmptyState
              title="Services will appear here soon"
              description="We are updating our service list. Call or WhatsApp us for POP & PVC ceiling work."
            />
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {services.data.map((service) => {
                const imgUrl = resolveServiceImage(service.cover_image_path, service.title);
                return (
                  <article
                    key={service.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d4af37] hover:shadow-xl"
                  >
                    {/* Top Golden Gradient Accent Bar */}
                    <div
                      aria-hidden="true"
                      className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#d4af37] to-amber-600"
                    />

                    <div>
                      {/* Service Image (Admin uploaded OR Auto-matched by Service Name) */}
                      <Link href={`/services/${service.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#1c1b19]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      </Link>

                      {/* Service Name & Description */}
                      <div className="p-6">
                        <Link href={`/services/${service.slug}`}>
                          <h2 className="font-sans text-xl font-extrabold leading-snug text-charcoal transition-colors group-hover:text-[#9A742E]">
                            {service.title}
                          </h2>
                        </Link>
                        {service.short_description ? (
                          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-stone">
                            {service.short_description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-[#F2ECE1] px-6 py-4">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#9A742E] transition group-hover:translate-x-1"
                      >
                        View Details
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 3. POP VS PVC COMPARISON & CTA */}
      <section className="border-t border-white/10 bg-[#161514] py-16 text-white sm:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#21201E] p-8">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#d4af37]">
                <Layers className="size-4" aria-hidden="true" />
                Plaster of Paris &amp; Gypsum
              </span>
              <h3 className="mt-2 font-sans text-2xl font-extrabold text-white">
                POP False Ceilings &amp; Moldings
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#d4af37]" />
                  <span>Seamless joint-free finish with custom LED cove lighting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#d4af37]" />
                  <span>Ideal for living rooms, bedrooms, halls, and decorative cornices</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#21201E] p-8">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#d4af37]">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Waterproof &amp; Termite-Proof
              </span>
              <h3 className="mt-2 font-sans text-2xl font-extrabold text-white">
                PVC Wall &amp; Ceiling Panels
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#d4af37]" />
                  <span>100% damp-proof solution for walls, kitchens, balconies, and shops</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#d4af37]" />
                  <span>Fast dust-free installation in wooden, marble, and matte textures</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#d4af37]/30 bg-white/5 p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-sans text-xl font-extrabold text-white sm:text-2xl">
                Not sure whether POP or PVC is right for your room?
              </h3>
              <p className="mt-1 text-sm text-white/75">
                Book a free site inspection in Bayad &amp; nearby areas for exact measurement and rate advice.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-charcoal transition hover:bg-[#c5a028]"
              >
                Get Free Quote
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
        </Container>
      </section>
    </>
  );
}
