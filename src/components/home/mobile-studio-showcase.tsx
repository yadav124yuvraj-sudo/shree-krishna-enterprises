"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const CEILING_RATES = [
  { id: "plain-pop", label: "Standard Plain POP Ceiling", rate: 85, market: "110–130" },
  { id: "cove-led", label: "Designer Cove LED False Ceiling", rate: 115, market: "145–175" },
  { id: "gypsum", label: "Gypsum & Grid False Ceiling", rate: 95, market: "120–150" },
  { id: "pvc-panel", label: "Waterproof PVC Wall / Ceiling Panel", rate: 75, market: "100–130" },
];

export function MobileStudioShowcase({
  whatsappNumber = "919428523958",
  phoneHref = "tel:+919428523958",
  businessName = "Shree Krishna Enterprises",
}: {
  whatsappNumber?: string;
  phoneHref?: string;
  businessName?: string;
}) {
  // Before / After Slider state
  const [sliderPos, setSliderPos] = useState(52);

  // Project Cost Calculator state
  const [sqft, setSqft] = useState(500);
  const [selectedType, setSelectedType] = useState(CEILING_RATES[0].id);

  const activePlan = CEILING_RATES.find((c) => c.id === selectedType) ?? CEILING_RATES[0];
  const estimatedCost = sqft * activePlan.rate;

  const estimateWhatsAppHref = buildWhatsAppLink({
    whatsappNumber,
    message: `Hello ${businessName}, I checked the Project Calculator on your website:\n• Area: ${sqft} sq.ft.\n• Requirement: ${activePlan.label}\n• Estimated Cost: ₹${estimatedCost.toLocaleString("en-IN")}\nPlease share exact quote and free site visit details.`,
  });

  return (
    <section className="bg-[#FAF7F0] py-14 text-charcoal sm:py-20">
      <Container className="space-y-16">
        {/* PART 1: Elevate Your Perspective + Before / After Drag Slider */}
        <div className="mx-auto max-w-xl">
          <h2 className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-charcoal sm:text-4xl">
            Elevate <span className="text-[#9A742E]">Your</span> Perspective.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone sm:text-base">
            Transforming raw spaces into architectural masterpieces. Flawless POP, LED cove lighting, and waterproof PVC finishes across Bayad &amp; Gujarat.
          </p>

          {/* Compact 3-Column Metrics */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[#E5DEC9] py-4">
            <div>
              <p className="font-sans text-2xl font-black text-[#9A742E]">500+</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone">Projects</p>
            </div>
            <div>
              <p className="font-sans text-2xl font-black text-[#9A742E]">10+</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone">Years Exp.</p>
            </div>
            <div>
              <p className="font-sans text-2xl font-black text-[#9A742E]">4.8</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone">Rating</p>
            </div>
          </div>

          {/* Interactive RAW SITE vs FINISHED POP Drag Slider */}
          <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E5DEC9] bg-charcoal shadow-lg select-none">
            {/* Finished POP (After - Base Layer) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
              alt="Finished POP Ceiling with LED Cove Lighting"
              className="h-full w-full object-cover"
            />

            {/* Raw Site (Before - Clipped Layer) */}
            <div
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
                alt="Raw Unfinished Ceiling Site"
                className="h-full w-full object-cover grayscale contrast-110"
              />
            </div>

            {/* Top Labels */}
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
              RAW SITE
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#d4af37] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-charcoal shadow">
              FINISHED POP
            </span>

            {/* Vertical Divider Line + Handle */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)]"
            >
              <div className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#161514]/90 text-white shadow-lg">
                <ChevronLeft className="size-3.5" />
                <ChevronRight className="size-3.5" />
              </div>
            </div>

            {/* Invisible Range Input for Smooth Touch & Mouse Dragging */}
            <input
              type="range"
              min={5}
              max={95}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Slide to compare raw site and finished POP ceiling"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
        </div>

        {/* PART 2: Interactive Project Cost Calculator (matches video_1.mp4 00:17) */}
        <div className="mx-auto max-w-xl rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-[0_14px_38px_-14px_rgba(0,0,0,0.12)] sm:p-8">
          <div className="text-center">
            <h3 className="font-sans text-2xl font-extrabold text-charcoal sm:text-3xl">
              Project <span className="text-[#9A742E]">Calculator</span>
            </h3>
            <p className="mt-1.5 text-xs text-stone sm:text-sm">
              Get an approximate POP / PVC estimate before you call.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {/* Area Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="calc-sqft" className="text-[11px] font-extrabold uppercase tracking-wider text-stone">
                  AREA IN SQ. FT.
                </label>
              </div>
              <input
                id="calc-sqft"
                type="range"
                min={100}
                max={2500}
                step={25}
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#EAE4D9] accent-[#179E67]"
              />
              <p className="mt-2 font-sans text-2xl font-black text-[#9A742E]">
                {sqft.toLocaleString("en-IN")} <span className="text-base font-bold">sq.ft.</span>
              </p>
            </div>

            {/* Requirement Type Dropdown */}
            <div>
              <label htmlFor="calc-type" className="block text-[11px] font-extrabold uppercase tracking-wider text-stone">
                REQUIREMENT TYPE
              </label>
              <select
                id="calc-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-2 w-full rounded-xl bg-[#161918] px-4 py-3.5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
              >
                {CEILING_RATES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Market Savings Callout */}
            <div className="flex items-start gap-3 rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] p-3.5">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#9A742E]" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-bold text-charcoal">
                  Direct contractor pricing — save 15%–20% vs market rate!
                </p>
                <p className="mt-0.5 text-stone">
                  Market average: ₹{activePlan.market}/sq.ft for similar quality
                </p>
              </div>
            </div>

            {/* Estimated Cost Box */}
            <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF7F0] p-5 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-stone">
                ESTIMATED COST
              </p>
              <p className="mt-1 font-sans text-4xl font-black tracking-tight text-[#9A742E]">
                ₹{estimatedCost.toLocaleString("en-IN")}*
              </p>
              <p className="mt-1.5 text-[11px] italic text-stone">
                *Based on standard rates. Actual quote requires a free site visit.
              </p>

              <div className="mt-5 space-y-2.5">
                <a
                  href={estimateWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#179E67] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#138556]"
                >
                  <MessageCircle className="size-4" />
                  SEND TO WHATSAPP
                </a>
                <a
                  href={phoneHref}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D2220] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-black"
                >
                  <Phone className="size-3.5 text-[#d4af37]" />
                  CALL NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
