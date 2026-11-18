import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i < value ? "size-4 fill-gold text-gold" : "size-4 text-line"}
        />
      ))}
    </span>
  );
}
