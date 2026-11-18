import Link from "next/link";
import {
  Award,
  Building2,
  CheckCircle2,
  Compass,
  Hammer,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { aboutContent as c } from "@/content/about";
import { getBusinessSettings, telHref } from "@/lib/business-settings";
import { pageMetadata } from "@/lib/seo";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "About Us | POP & PVC Interior Specialists",
  description: "A family-owned POP and PVC interior business. Meet the team and see how we work.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getBusinessSettings();
  const phone = telHref(settings);
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <>
      {/* 1. LUXURY DARK HEADER BANNER */}
      <section className="relative overflow-hidden bg-[#161514] py-16 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_60%)]"
        />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Who We Are
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About <span className="text-[#d4af37]">{settings.name}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {settings.aboutIntro}
          </p>

          {/* 3 Quick Highlight Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white/90">
              <Award className="size-4 text-[#d4af37]" aria-hidden="true" />
              Family-Owned Craft
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white/90">
              <ShieldCheck className="size-4 text-[#d4af37]" aria-hidden="true" />
              Direct Owner Supervision
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white/90">
              <MapPin className="size-4 text-[#d4af37]" aria-hidden="true" />
              Bayad &amp; Surrounding Areas
            </div>
          </div>
        </Container>
      </section>

      {/* 2. OUR STORY & OUR WORKMANSHIP (Warm Ivory + Elevated Architectural Cards) */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Story Card */}
            <article className="relative overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white p-8 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.08)] sm:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#d4af37] to-amber-600"
              />
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-[#9A742E]">
                <Compass className="size-6" aria-hidden="true" />
              </div>
              <span className="mt-5 block text-xs font-bold uppercase tracking-[0.2em] text-[#9A742E]">
                Our Heritage
              </span>
              <h2 className="mt-1 font-sans text-2xl font-extrabold text-charcoal sm:text-3xl">
                Our Story
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-stone sm:text-lg">
                {settings.aboutStory}
              </p>
            </article>

            {/* Workmanship Card */}
            <article className="relative overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white p-8 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.08)] sm:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-charcoal via-[#9A742E] to-[#d4af37]"
              />
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-[#9A742E]">
                <Hammer className="size-6" aria-hidden="true" />
              </div>
              <span className="mt-5 block text-xs font-bold uppercase tracking-[0.2em] text-[#9A742E]">
                Quality Standards
              </span>
              <h2 className="mt-1 font-sans text-2xl font-extrabold text-charcoal sm:text-3xl">
                Our Workmanship
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-stone sm:text-lg">
                {settings.aboutWorkmanship}
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* 3. HOW WE WORK & CORE VALUES (Rich Dark Luxury Section) */}
      <section className="border-t border-white/10 bg-[#181817] py-16 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              Our Principles
            </span>
            <h2 className="mt-2 font-sans text-3xl font-extrabold text-white sm:text-4xl">
              How We Work
            </h2>
            <p className="mt-3 text-sm text-white/75">
              Clear communication, verified GI channels &amp; materials, and neat on-site execution from day one.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {c.values.map((v, idx) => (
              <div
                key={v.title}
                className="rounded-2xl border border-white/10 bg-[#21201E] p-8 transition hover:-translate-y-1 hover:border-[#d4af37]/60"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 font-sans text-sm font-extrabold text-[#d4af37]">
                  0{idx + 1}
                </span>
                <h3 className="mt-5 font-sans text-xl font-bold text-white">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. THE TEAM & SERVICE COVERAGE (Warm Ivory + Architectural Split Box) */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-[#E6DFD3] bg-white shadow-sm">
            <div className="grid lg:grid-cols-12">
              <div className="p-8 sm:p-12 lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9A742E]">
                  <Users className="size-3.5" aria-hidden="true" />
                  Meet The Team
                </div>
                <h2 className="mt-4 font-sans text-3xl font-extrabold text-charcoal sm:text-4xl">
                  Skilled Artisans, Direct Accountability
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-stone">
                  <p className="whitespace-pre-line">{settings.aboutTeam}</p>
                  {settings.aboutDetails ? (
                    <p className="whitespace-pre-line border-t border-[#F0EAE0] pt-4 text-charcoal/90">
                      {settings.aboutDetails}
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1fb874] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#199e63]"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                  {phone ? (
                    <a
                      href={phone}
                      className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-charcoal/90"
                    >
                      <Phone className="size-4 text-[#d4af37]" aria-hidden="true" />
                      Call {settings.phoneDisplay}
                    </a>
                  ) : null}
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 rounded-full border border-[#DFD5C5] bg-[#FAF8F5] px-7 py-3.5 text-sm font-bold text-charcoal transition hover:border-charcoal"
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>

              {/* Right Highlights Column */}
              <div className="flex flex-col justify-between bg-[#161514] p-8 text-white sm:p-12 lg:col-span-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                    Why Homeowners Trust Us
                  </span>
                  <h3 className="mt-2 font-sans text-2xl font-extrabold text-white">
                    Our Promise on Every Site
                  </h3>
                  <ul className="mt-6 space-y-4 text-sm text-white/85">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d4af37]" aria-hidden="true" />
                      <span>Free on-site measurement &amp; ceiling level inspection before quoting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d4af37]" aria-hidden="true" />
                      <span>Genuine Gypsum, Plaster of Paris, GI framing &amp; heavy-duty PVC panels</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d4af37]" aria-hidden="true" />
                      <span>Clean electrical cove-light &amp; fan-box cutouts with smooth finishing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Building2 className="mt-0.5 size-5 shrink-0 text-[#d4af37]" aria-hidden="true" />
                      <span>Serving residential homes, bungalows, offices, shops &amp; showrooms</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/15 pt-6">
                  <Link
                    href="/join-our-team"
                    className="text-xs font-bold uppercase tracking-wider text-[#d4af37] hover:underline"
                  >
                    Are you a POP / PVC craftsman? Join our team →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
