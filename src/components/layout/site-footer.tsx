import type { BusinessSettings } from "@/lib/business-settings";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  getBusinessSettings,
  hasAddress,
  hasEmail,
  hasHours,
  telHref,
} from "@/lib/business-settings";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const exploreLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Our Projects" },
  { href: "/designs", label: "Designs" },
  { href: "/about", label: "About Us" },
  { href: "/reviews", label: "Reviews" },
];

const resourceLinks = [
  { href: "/custom-design", label: "Custom Design Request" },
  { href: "/inspiration", label: "Inspiration" },
  { href: "/faq", label: "FAQ" },
  { href: "/join-our-team", label: "Join Our Team" },
  { href: "/contact", label: "Contact" },
];

export async function SiteFooter(_props: { settings?: BusinessSettings; showFaq?: boolean }) {
  const settings = await getBusinessSettings();
  const phone = telHref(settings);
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <footer className="relative border-t border-[#d4af37]/30 bg-[#141413] text-white">
      {/* Subtle Top Golden Glow Line */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent"
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Quick Actions (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <span className="font-sans text-2xl font-extrabold tracking-tight text-white">
                {settings.name}
              </span>
              <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
                POP &amp; PVC Interior Specialists
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              {settings.tagline ||
                "Transforming residential and commercial spaces with bespoke POP false ceilings, architectural moldings, and waterproof PVC wall panels."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#1fb874] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#199e63]"
              >
                <MessageCircle className="size-3.5" aria-hidden="true" />
                WhatsApp Us
              </a>
              <Link
                href="/quote"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/50 bg-[#d4af37]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d4af37] transition hover:bg-[#d4af37] hover:text-charcoal"
              >
                Free Quote
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Column 2: Explore (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d4af37]">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/75 transition hover:translate-x-1 hover:text-[#d4af37] inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d4af37]">
              Client Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/75 transition hover:translate-x-1 hover:text-[#d4af37] inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Hours (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d4af37]">
              Reach Us
            </h3>
            <address className="mt-5 space-y-4 not-italic text-sm text-white/80">
              {settings.phoneDisplay ? (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#d4af37]">
                    <Phone className="size-3.5" aria-hidden="true" />
                  </span>
                  {phone ? (
                    <a href={phone} className="font-semibold text-white transition hover:text-[#d4af37]">
                      {settings.phoneDisplay}
                    </a>
                  ) : (
                    <span className="font-semibold text-white">{settings.phoneDisplay}</span>
                  )}
                </div>
              ) : null}

              {hasEmail(settings) || settings.email ? (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#d4af37]">
                    <Mail className="size-3.5" aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all transition hover:text-[#d4af37]"
                  >
                    {settings.email}
                  </a>
                </div>
              ) : null}

              {hasAddress(settings) || settings.address ? (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#d4af37]">
                    <MapPin className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="whitespace-pre-line leading-relaxed">
                    {settings.address}
                  </span>
                </div>
              ) : null}

              {hasHours(settings) || settings.workingHours ? (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#d4af37]">
                    <Clock className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>{settings.workingHours}</span>
                </div>
              ) : null}
            </address>
          </div>
        </div>

        {/* Bottom Copyright & Policy Strip */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="transition hover:text-[#d4af37]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-[#d4af37]">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/40">Bayad, Gujarat</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
