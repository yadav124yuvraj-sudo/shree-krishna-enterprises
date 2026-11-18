import { MessageCircle, Sparkles, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ReviewForm } from "@/components/forms/review-form";
import { ItemImage } from "@/components/shared/item-image";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getApprovedReviews, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Customer Reviews | Shree Krishna Enterprises",
  description: "Reviews from customers of Shree Krishna Enterprises. Every review is checked before it is shown.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const [settings, reviews, projects] = await Promise.all([
    getBusinessSettings(),
    getApprovedReviews(),
    getProjects(),
  ]);

  const projectOptions = projects.data.map((p) => ({ id: p.id, title: p.title }));
  const whatsappHref = buildWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    message: buildEnquiryMessage({ kind: "general" }),
  });

  return (
    <>
      {/* 1. LUXURY DARK HEADER BANNER */}
      <section className="relative overflow-hidden bg-[#161514] py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_60%)]"
        />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Client Feedback
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Customer Reviews
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Real feedback from homeowners, shopkeepers, and builders who trusted {settings.name} for their POP &amp; PVC interiors.
          </p>
          <div className="mt-7">
            <a
              href="#write-review"
              className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-charcoal shadow-md transition hover:bg-[#c5a028]"
            >
              Write a Review
            </a>
          </div>
        </Container>
      </section>

      {/* 2. APPROVED CUSTOMER REVIEWS */}
      <section className="bg-white py-16 text-charcoal sm:py-20">
        <Container>
          {reviews.failed ? (
            <ErrorState />
          ) : reviews.data.length === 0 ? (
            <EmptyState
              title="Be the first to share your experience"
              description="Had POP ceiling or PVC panel work done by us? Submit your review below and help other homeowners choose with confidence."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.data.map((r) => {
                const date = new Date(r.created_at).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                });
                return (
                  <article
                    key={r.id}
                    className="flex flex-col justify-between rounded-2xl border border-[#EAE4D9] bg-[#FAF8F5] p-6 shadow-xs transition hover:border-[#D4B97B]"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-[#d4af37]" aria-label={`${r.rating} out of 5 stars`}>
                        {Array.from({ length: r.rating }).map((_, idx) => (
                          <Star key={idx} className="size-4 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-charcoal/90">
                        &ldquo;{r.body}&rdquo;
                      </p>

                      {r.review_images.length > 0 ? (
                        <ul className="mt-4 grid grid-cols-3 gap-2">
                          {r.review_images.map((img, i) => (
                            <li key={img.storage_path} className="overflow-hidden rounded-lg border border-[#E6DFD3]">
                              <ItemImage
                                path={img.storage_path}
                                alt={`Photo from ${r.reviewer_name}'s review ${i + 1}`}
                                className="aspect-square"
                                sizes="120px"
                              />
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <footer className="mt-6 border-t border-[#EAE4D9] pt-4">
                      <p className="font-sans text-sm font-bold text-charcoal">
                        {r.reviewer_name}
                        {r.reviewer_location ? (
                          <span className="font-normal text-stone"> · {r.reviewer_location}</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-stone">{date}</p>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 3. SUBMIT YOUR REVIEW (Centered Warm Ivory + Elevated White Card) */}
      <section id="write-review" className="border-t border-[#EAE4D9] bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-[#B5892E] sm:text-4xl">
              Submit Your Review
            </h2>
            <p className="mt-2.5 text-sm text-stone sm:text-base">
              Your feedback helps us improve and helps other customers make the right choice
            </p>
          </div>

          <ReviewForm projects={projectOptions} />

          <div className="mt-8 text-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone transition hover:text-[#1fb874]"
            >
              <MessageCircle className="size-4 text-[#1fb874]" aria-hidden="true" />
              Prefer sending feedback directly on WhatsApp? Click here
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
