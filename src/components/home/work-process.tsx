import { Section } from "@/components/layout/section";

const steps = [
  {
    step: "01",
    title: "Consultation",
    description:
      "Share your room size, ceiling type preference, or photos via our quotation form or WhatsApp.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Select from our curated design catalog or provide custom reference images for cove, tray, or paneling.",
  },
  {
    step: "03",
    title: "Site Visit",
    description:
      "We inspect the site in person to verify exact dimensions, electrical conduit spots, and prepare the final quote.",
  },
  {
    step: "04",
    title: "Execution",
    description:
      "Our skilled team installs framing channels, POP moulding, or PVC panels with accurate laser levelling.",
  },
  {
    step: "05",
    title: "Handover",
    description:
      "Final surface check, cove lighting cutouts verified, site cleaned up, and room handed over ready for paint.",
  },
];

export function WorkProcess() {
  return (
    <Section id="process">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
          Step by Step
        </span>
        <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">How We Work</h2>
        <p className="mt-3 max-w-2xl text-stone">
          From your room idea to the final ceiling handover, we keep the process clear, predictable, and on schedule.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((item) => (
          <div
            key={item.step}
            className="relative rounded-sm border border-line bg-warm-white p-6 shadow-xs"
          >
            <span className="font-serif text-3xl font-light text-gold-deep">
              {item.step}
            </span>
            <h3 className="mt-3 font-serif text-lg text-charcoal">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
