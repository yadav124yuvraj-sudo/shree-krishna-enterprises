"use client";

import Link from "next/link";
import { DesignCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import { useFavourites } from "@/lib/favourites";
import type { Design } from "@/lib/types";

export function SavedDesignsGrid({ designs }: { designs: Design[] }) {
  const saved = useFavourites();
  const shown = designs.filter((d) => saved.includes(d.slug));

  if (shown.length === 0) {
    return (
      <EmptyState
        title="No saved designs yet"
        description="Tap the heart on any design to keep it here. Saved designs stay on this phone only."
        action={
          <Button asChild>
            <Link href="/designs">Browse designs</Link>
          </Button>
        }
      />
    );
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((d) => (
        <DesignCard key={d.id} design={d} showFavourite />
      ))}
    </div>
  );
}
