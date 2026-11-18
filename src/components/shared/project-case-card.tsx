import Link from "next/link";
import { ArrowUpRight, Clock, Layers, MapPin, Home } from "lucide-react";
import { getPublicMediaUrl } from "@/lib/supabase/public";

export type CaseStudyProject = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  location?: string | null;
  cover_image_path?: string | null;
  category?: string | null;
  service_type?: string | null;
};

const FALLBACK_LOCATIONS = ["Bayad", "Modasa", "Himatnagar", "Kapadvanj", "Dehgam", "Gandhinagar"];

function extractCaseMetadata(project: CaseStudyProject, index: number) {
  const text = `${project.title || ""} ${project.summary || ""} ${project.category || ""} ${project.service_type || ""}`.toLowerCase();

  // 1. Detect Room Type
  let roomType = "Living Hall";
  if (text.includes("bedroom") || text.includes("master")) roomType = "Master Bedroom";
  else if (text.includes("office") || text.includes("showroom") || text.includes("shop") || text.includes("commercial"))
    roomType = "Commercial / Office";
  else if (text.includes("kitchen") || text.includes("dining")) roomType = "Dining & Kitchen";
  else if (text.includes("tv") || text.includes("wall")) roomType = "Feature TV Wall";
  else if (text.includes("villa") || text.includes("bungalow") || text.includes("duplex")) roomType = "Full Bungalow";

  // 2. Detect Material Used
  let material = "POP + LED Cove";
  if (text.includes("pvc") && text.includes("pop")) material = "POP & PVC Hybrid";
  else if (text.includes("pvc") || text.includes("wpc") || text.includes("louver") || text.includes("fluted"))
    material = "Waterproof PVC Panels";
  else if (text.includes("gypsum") || text.includes("grid")) material = "Gypsum False Ceiling";
  else if (text.includes("cornice") || text.includes("molding") || text.includes("moulding"))
    material = "Royal POP Molding";

  // 3. Detect Completion Days (from text like "4 days" or smart estimate)
  const dayMatch = text.match(/(\d+)\s*(day|days)/);
  const completionDays = dayMatch
    ? `${dayMatch[1]} Days`
    : material.includes("PVC")
      ? "2 Days"
      : roomType === "Full Bungalow"
        ? "12 Days"
        : "4 Days";

  // 4. Location
  const location =
    project.location && project.location.trim().length > 0
      ? project.location.trim()
      : FALLBACK_LOCATIONS[index % FALLBACK_LOCATIONS.length];

  return { roomType, material, completionDays, location };
}

export function ProjectCaseCard({
  project,
  index = 0,
}: {
  project: CaseStudyProject;
  index?: number;
}) {
  const imageUrl =
    getPublicMediaUrl(project.cover_image_path ?? null) ||
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80";

  const meta = extractCaseMetadata(project, index);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white shadow-[0_12px_32px_-14px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d4af37] hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.22)]">
      {/* Image Container with Floating Studio Badges */}
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/11] w-full overflow-hidden bg-[#161514]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top-Left Location Badge */}
        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
          <MapPin className="size-3 text-[#d4af37]" aria-hidden="true" />
          {meta.location}, Gujarat
        </span>

        {/* Top-Right Completion Time Badge */}
        <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full border border-[#d4af37]/40 bg-[#161514]/85 px-2.5 py-1 text-[11px] font-bold text-[#f3d473] backdrop-blur-md">
          <Clock className="size-3" aria-hidden="true" />
          {meta.completionDays}
        </span>

        {/* Bottom Overlay Room Type Tag */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#d4af37] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-charcoal">
            <Home className="size-3" aria-hidden="true" />
            {meta.roomType}
          </span>
        </div>
      </Link>

      {/* Content & Architectural Specs */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <Link href={`/projects/${project.slug}`} className="group/title flex items-start justify-between gap-2">
            <h3 className="font-sans text-xl font-extrabold leading-snug text-charcoal transition-colors group-hover/title:text-[#9A742E]">
              {project.title}
            </h3>
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#EAE4D9] text-charcoal transition-all group-hover:border-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-charcoal">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </Link>

          {project.summary ? (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-stone">
              {project.summary}
            </p>
          ) : null}
        </div>

        {/* Material & Execution Spec Strip */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F2ECE1] pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 font-bold text-charcoal/85">
            <Layers className="size-3.5 text-[#9A742E]" aria-hidden="true" />
            {meta.material}
          </span>
          <Link
            href={`/projects/${project.slug}`}
            className="font-extrabold uppercase tracking-wider text-[#9A742E] hover:underline"
          >
            Case Study &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
