"use client";

import { Heart } from "lucide-react";
import { toggleFavourite, useFavourites } from "@/lib/favourites";
import { cn } from "@/lib/utils";

/** Save a design on this device. variant "icon" sits on a card, "full" is a labelled button. */
export function FavouriteButton({
  slug,
  title,
  variant = "icon",
}: {
  slug: string;
  title: string;
  variant?: "icon" | "full";
}) {
  const saved = useFavourites().includes(slug);
  const label = saved ? `Remove ${title} from saved designs` : `Save ${title}`;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggleFavourite(slug)}
        aria-pressed={saved}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-charcoal/70 px-6 text-[0.95rem] font-medium text-charcoal hover:bg-beige"
      >
        <Heart aria-hidden="true" className={cn("size-4", saved && "fill-gold text-gold")} />
        {saved ? "Saved" : "Save design"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavourite(slug)}
      aria-pressed={saved}
      aria-label={label}
      className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-full bg-warm-white/90 text-charcoal shadow-sm hover:bg-warm-white"
    >
      <Heart aria-hidden="true" className={cn("size-5", saved && "fill-gold text-gold")} />
    </button>
  );
}
