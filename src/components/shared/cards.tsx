import { ProjectCaseCard } from "@/components/shared/project-case-card";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import Link from "next/link";
import { Layers } from "lucide-react";
import { designCover, projectCover } from "@/lib/content";
import { resolveServiceImage } from "@/lib/service-images";
import { getPublicMediaUrl } from "@/lib/supabase/public";
import type { Design, Project, Review, Service } from "@/lib/types";
import { ItemImage } from "./item-image";
import { FavouriteButton } from "./favourite-button";
import { StarRating } from "./star-rating";

export function ServiceCard({ service }: { service: Service }) {
  const imgUrl = resolveServiceImage(service.cover_image_path, service.title);
  return (
    <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white text-[#161514] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d4af37] hover:shadow-xl">
      <Link href={`/services/${service.slug}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#1c1b19]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="bg-white p-5">
          <h3 className="font-sans text-lg font-extrabold leading-snug !text-[#161514] transition-colors group-hover:!text-[#9A742E] sm:text-xl">
            {service.title}
          </h3>
          {service.short_description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed !text-[#57534E]">
              {service.short_description}
            </p>
          ) : null}
          <span className="mt-3 inline-block text-xs font-extrabold uppercase tracking-wider !text-[#9A742E]">
            View Details &rarr;
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <ScrollReveal>
      <ProjectCaseCard project={project} />
    </ScrollReveal>
  );
}

export function DesignCard({ design, showFavourite }: { design: Design; showFavourite: boolean }) {
  const cover = designCover(design);
  return (
    <article className="group relative">
      <Link href={`/designs/${design.slug}`} className="block">
        <ItemImage path={cover?.path} alt={cover?.alt ?? design.title} className="aspect-[4/3]" />
        <h3 className="mt-4 text-xl text-charcoal group-hover:text-gold-deep">{design.title}</h3>
      </Link>
      {showFavourite ? <FavouriteButton slug={design.slug} title={design.title} /> : null}
    </article>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return (
    <article className="flex h-full flex-col rounded-sm border border-line bg-warm-white p-6">
      <StarRating rating={review.rating} />
      <p className="mt-4 flex-1 leading-relaxed text-charcoal">{review.body}</p>
      <footer className="mt-5 text-sm text-stone">
        <p className="font-medium text-charcoal">
          {review.reviewer_name}
          {review.reviewer_location ? `, ${review.reviewer_location}` : ""}
        </p>
        <p>{date}</p>
        {review.projects ? (
          <p className="mt-1">
            Project:{" "}
            <Link href={`/projects/${review.projects.slug}`} className="underline hover:text-gold-deep">
              {review.projects.title}
            </Link>
          </p>
        ) : null}
      </footer>
    </article>
  );
}
