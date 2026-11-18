import { Clock, Mail, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { ServiceAreasGrid } from "@/components/shared/service-areas-grid";
import { getBusinessSettings, hasAddress, hasEmail, hasHours, telHref } from "@/lib/business-settings";
import { getServiceAreas, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Contact Us | Shree Krishna Enterprises",
  description: "Call, WhatsApp or email Shree Krishna Enterprises. Business address, working hours and service areas.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, areas, services] = await Promise.all([
    getBusinessSettings(),
    getServiceAreas(),
    getServices(),
  ]);

  const phone = telHref(settings);
  const mapOk = settings.mapEmbedUrl.startsWith("https://www.google.com/maps/embed");
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  const serviceOptions = services.data.map((s) => ({ id: s.id, title: s.title }));

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
            Get In Touch
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Contact <span className="text-[#d4af37]">Us</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Have a ceiling or wall paneling project in mind? Reach out via call, WhatsApp, or send us a message below for a free site measurement.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1fb874] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#199e63]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
            {phone ? (
              <a
                href={phone}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white hover:text-charcoal"
              >
                <Phone className="size-4 text-[#d4af37]" aria-hidden="true" />
                Call {settings.phoneDisplay}
              </a>
            ) : null}
          </div>
        </Container>
      </section>

      {/* 2. CONTACT DETAILS + LIVE MESSAGE FORM (Warm Ivory Architectural Layout) */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-12">
            {/* Left Column: Business Info Cards */}
            <div className="space-y-5 lg:col-span-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A742E]">
                  Direct Contact
                </span>
                <h2 className="mt-1 font-sans text-2xl font-extrabold text-charcoal sm:text-3xl">
                  Reach {settings.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  The quickest way to book a site visit is a direct call or WhatsApp message with your room photos or dimensions.
                </p>
              </div>

              <address className="space-y-4 not-italic">
                {/* Phone Card */}
                <div className="flex items-start gap-4 rounded-2xl border border-[#EAE4D9] bg-white p-5 shadow-xs">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#9A742E]">
                    <Phone className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-stone">
                      Phone &amp; WhatsApp
                    </span>
                    {phone ? (
                      <a
                        href={phone}
                        className="mt-1 block font-sans text-lg font-extrabold text-charcoal transition hover:text-[#9A742E]"
                      >
                        {settings.phoneDisplay}
                      </a>
                    ) : (
                      <span className="mt-1 block font-sans text-lg font-extrabold text-charcoal">
                        {settings.phoneDisplay}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email Card */}
                {hasEmail(settings) || settings.email ? (
                  <div className="flex items-start gap-4 rounded-2xl border border-[#EAE4D9] bg-white p-5 shadow-xs">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#9A742E]">
                      <Mail className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone">
                        Email Address
                      </span>
                      {hasEmail(settings) ? (
                        <a
                          href={`mailto:${settings.email}`}
                          className="mt-1 block break-all font-sans text-base font-bold text-charcoal transition hover:text-[#9A742E]"
                        >
                          {settings.email}
                        </a>
                      ) : (
                        <span className="mt-1 block break-all font-sans text-base font-bold text-charcoal">
                          {settings.email}
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Address Card */}
                {hasAddress(settings) || settings.address ? (
                  <div className="flex items-start gap-4 rounded-2xl border border-[#EAE4D9] bg-white p-5 shadow-xs">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#9A742E]">
                      <MapPin className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone">
                        Workshop &amp; Office
                      </span>
                      <span className="mt-1 block whitespace-pre-line text-sm font-semibold leading-relaxed text-charcoal">
                        {settings.address}
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Working Hours Card */}
                {hasHours(settings) || settings.workingHours ? (
                  <div className="flex items-start gap-4 rounded-2xl border border-[#EAE4D9] bg-white p-5 shadow-xs">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#9A742E]">
                      <Clock className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone">
                        Working Hours
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-charcoal">
                        {settings.workingHours}
                      </span>
                    </div>
                  </div>
                ) : null}
              </address>
            </div>

            {/* Right Column: Interactive Message Form */}
            <div className="lg:col-span-7">
              <ContactForm services={serviceOptions} />
            </div>
          </div>

          {/* Full-Width Map Embed */}
          {mapOk ? (
            <div className="mt-16 overflow-hidden rounded-3xl border border-[#E6DFD3] bg-white p-2 shadow-md">
              <iframe
                src={settings.mapEmbedUrl}
                title="Map showing Shree Krishna Enterprises location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full rounded-2xl border-0 sm:h-[420px]"
              />
            </div>
          ) : null}
        </Container>
      </section>

      {/* 3. SERVICE AREAS (Dark Luxury Footer Band) */}
      
            <ServiceAreasGrid areas={areas.data} />
    </>
  );
}
