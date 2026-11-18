import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Section } from "@/components/layout/section";

export type ReviewItem = {
  id: string;
  reviewer_name: string;
  reviewer_location: string | null;
  rating: number;
  body: string;
  is_verified: boolean;
};

interface ClientReviewsProps {
  reviews: ReviewItem[];
}

export function ClientReviews({ reviews }: ClientReviewsProps) {
  // If there are no approved reviews, completely hide the section.
  // Never fabricate or invent reviews.
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <Section tone="beige" id="reviews">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
          Testimonials
        </span>
        <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">Client Reviews</h2>
        <p className="mt-3 max-w-2xl text-stone">
          Feedback from verified homeowners and property managers who worked with us.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((rev) => (
          <Card key={rev.id} className="flex flex-col justify-between">
            <CardHeader>
              <div
                className="flex items-center gap-1 text-gold"
                aria-label={`${rev.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < rev.rating ? "fill-gold text-gold" : "text-line"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <CardDescription className="mt-4 text-base italic leading-relaxed text-charcoal">
                &ldquo;{rev.body}&rdquo;
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border-t border-line/70 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-charcoal">{rev.reviewer_name}</p>
                    {rev.reviewer_location ? (
                      <p className="truncate text-xs text-stone">{rev.reviewer_location}</p>
                    ) : null}
                  </div>
                  {rev.is_verified ? (
                    <Badge variant="gold" className="shrink-0 text-[10px]">
                      Verified
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
