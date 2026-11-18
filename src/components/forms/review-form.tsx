"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, ImagePlus, Send, Star } from "lucide-react";
import { submitReview, type ReviewActionState } from "@/app/(site)/reviews/actions";

export function ReviewForm({
  projects = [],
}: {
  projects?: { id: string; title: string }[];
}) {
  const [state, formAction, isPending] = useActionState<ReviewActionState | null, FormData>(
    submitReview,
    null,
  );
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  const activeRating = hoverRating || rating;

  if (state?.ok) {
    return (
      <div
        role="status"
        className="mx-auto max-w-3xl rounded-3xl border border-[#d4af37]/50 bg-white p-10 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)]"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-[#9A742E]">
          <CheckCircle2 className="size-9" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-sans text-2xl font-extrabold text-charcoal">
          Thank You for Your Review!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto max-w-3xl rounded-3xl border border-[#EAE4D9] bg-white p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] sm:p-10"
    >
      <input type="hidden" name="rating" value={rating} />

      {/* Row 1: Your Name + Your Location */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="rev_name"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Your Name *
          </label>
          <input
            id="rev_name"
            name="reviewer_name"
            type="text"
            required
            maxLength={100}
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
          />
        </div>

        <div>
          <label
            htmlFor="rev_location"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Your Location
          </label>
          <input
            id="rev_location"
            name="reviewer_location"
            type="text"
            maxLength={100}
            placeholder="Bayad, Modasa, Himatnagar etc."
            className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
          />
        </div>
      </div>

      {/* Row 2: Project (Optional) + Photos (Optional) */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {projects.length > 0 ? (
          <div>
            <label
              htmlFor="rev_project"
              className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
            >
              Project <span className="font-normal text-stone">(Optional)</span>
            </label>
            <select
              id="rev_project"
              name="project_id"
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
            >
              <option value="">General POP / PVC Work</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className={projects.length > 0 ? "" : "sm:col-span-2"}>
          <label
            htmlFor="rev_photos"
            className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
          >
            Work Photos <span className="font-normal text-stone">(Optional, up to 3)</span>
          </label>
          <label
            htmlFor="rev_photos"
            className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#D4B97B] bg-[#FAF8F5] px-4 py-3 text-sm text-stone transition hover:border-[#9A742E] hover:bg-amber-50/40"
          >
            <span className="inline-flex items-center gap-2 truncate">
              <ImagePlus className="size-4 shrink-0 text-[#9A742E]" aria-hidden="true" />
              {fileCount > 0 ? `${fileCount} photo(s) selected` : "Upload ceiling / wall photos"}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A742E]">Browse</span>
          </label>
          <input
            id="rev_photos"
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
            className="sr-only"
          />
        </div>
      </div>

      {/* Row 3: Your Rating (5 Large Clickable Stars) */}
      <div className="mt-6">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-charcoal">
          Your Rating *
        </span>
        <div className="mt-2.5 flex items-center gap-2" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= activeRating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-checked={rating === star}
                role="radio"
                className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              >
                <Star
                  className={`size-8 transition-colors ${
                    filled
                      ? "fill-[#d4af37] text-[#d4af37]"
                      : "fill-stone/20 text-stone/35"
                  }`}
                />
              </button>
            );
          })}
          <span className="ml-2 text-xs font-semibold text-stone">
            ({rating} / 5)
          </span>
        </div>
      </div>

      {/* Row 4: Your Review Textarea */}
      <div className="mt-6">
        <label
          htmlFor="rev_body"
          className="block text-xs font-extrabold uppercase tracking-wider text-charcoal"
        >
          Your Review *
        </label>
        <textarea
          id="rev_body"
          name="body"
          required
          minLength={10}
          maxLength={1500}
          rows={4}
          placeholder="Tell us about your experience with our POP ceiling or PVC panel service..."
          className="mt-2 w-full rounded-xl border border-[#D4B97B] bg-white px-4 py-3.5 text-sm leading-relaxed text-charcoal outline-none transition placeholder:text-stone/60 focus:border-[#9A742E] focus:ring-2 focus:ring-[#d4af37]/25"
        />
      </div>

      {/* Row 5: Privacy Consent Checkbox */}
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-stone">
        <input
          type="checkbox"
          name="privacy_consent"
          value="true"
          defaultChecked
          required
          className="mt-0.5 size-4 shrink-0 rounded border-[#D4B97B] accent-[#9A742E]"
        />
        <span>
          I agree that my name, location, review, and uploaded photos may be displayed publicly on the website once approved.
        </span>
      </label>

      {state && !state.ok ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}

      {/* Full-Width Royal Gold Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#c59b32] via-[#d4af37] to-[#b88924] px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-charcoal shadow-lg transition hover:brightness-105 disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden="true" />
        {isPending ? "Submitting Review..." : "Submit Your Review"}
      </button>
    </form>
  );
}
