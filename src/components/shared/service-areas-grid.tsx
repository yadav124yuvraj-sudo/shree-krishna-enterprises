import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getBusinessSettings } from "@/lib/business-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type AreaItem = {
  id: string;
  name: string;
  stateLabel?: string;
};

const DEFAULT_GUJARAT_AREAS: AreaItem[] = [
  { id: "area-1", name: "Bayad", stateLabel: "Gujarat" },
  { id: "area-2", name: "Modasa", stateLabel: "Gujarat" },
  { id: "area-3", name: "Himatnagar", stateLabel: "Gujarat" },
  { id: "area-4", name: "Kapadvanj", stateLabel: "Gujarat" },
  { id: "area-5", name: "Dehgam", stateLabel: "Gujarat" },
  { id: "area-6", name: "Dhansura", stateLabel: "Gujarat" },
  { id: "area-7", name: "Malpur", stateLabel: "Gujarat" },
  { id: "area-8", name: "Talod", stateLabel: "Gujarat" },
  { id: "area-9", name: "Prantij", stateLabel: "Gujarat" },
  { id: "area-10", name: "Idar", stateLabel: "Gujarat" },
  { id: "area-11", name: "Lunawada", stateLabel: "Gujarat" },
  { id: "area-12", name: "Balasinor", stateLabel: "Gujarat" },
  { id: "area-13", name: "Kathlal", stateLabel: "Gujarat" },
  { id: "area-14", name: "Gandhinagar", stateLabel: "Gujarat" },
  { id: "area-15", name: "Ahmedabad East", stateLabel: "Gujarat" },
];

export async function ServiceAreasGrid({
  areas = [],
}: {
  areas?: { id: string; name: string }[];
}) {
  const settings = await getBusinessSettings();

  const adminMapped: AreaItem[] = areas.map((a) => ({
    id: a.id,
    name: a.name,
    stateLabel: "Gujarat",
  }));

  const existingNames = new Set(adminMapped.map((a) => a.name.toLowerCase().trim()));
  const displayAreas =
    adminMapped.length >= 5
      ? adminMapped
      : [
          ...adminMapped,
          ...DEFAULT_GUJARAT_AREAS.filter((d) => !existingNames.has(d.name.toLowerCase())),
        ];

  return (
    <section id="service-areas" className="border-t border-white/10 bg-[#0D0D0C] py-16 text-white sm:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#d4af37]">
            Service Coverage
          </span>
          <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Areas We Serve Across Gujarat
          </h2>
          <p className="mt-2.5 text-sm text-white/65">
            Click your location below to book a free POP &amp; PVC site measurement visit on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {displayAreas.map((area) => {
            const state = area.stateLabel || "Gujarat";
            const whatsappHref = buildWhatsAppLink({
              whatsappNumber: settings.whatsappNumber,
              message: `Hello ${settings.name}, I would like to book a free POP & PVC site visit in ${area.name}, ${state}. Please share your available time.`,
            });

            return (
              <a
                key={area.id}
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Book free visit in ${area.name}, ${state} on WhatsApp`}
                className="group flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#161615] px-3 py-4 sm:px-4 sm:py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:bg-[#1D1C1A] hover:shadow-[0_10px_25px_-10px_rgba(212,175,55,0.25)]"
              >
                <span className="inline-flex items-center gap-1 text-xs font-medium text-white/45 transition-colors group-hover:text-[#d4af37]">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {state}
                </span>

                <h3 className="mt-2 font-sans text-base font-extrabold tracking-tight text-white transition-colors group-hover:text-[#f3d473] sm:text-[17px]">
                  {area.name}
                </h3>

                <span className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 transition-colors group-hover:text-[#1fb874]">
                  BOOK FREE VISIT &rarr;
                </span>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
