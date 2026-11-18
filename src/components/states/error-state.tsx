import { Button } from "@/components/ui/button";

/** Plain-language error with a retry action. */
export function ErrorState({
  title = "This page could not load",
  description = "Check your internet connection and try again. If it keeps happening, contact us on WhatsApp.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-sm border border-line bg-beige/40 px-6 py-14 text-center"
    >
      <h2 className="font-serif text-2xl text-charcoal">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-stone">{description}</p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button onClick={onRetry}>Try again</Button>
        </div>
      ) : null}
    </div>
  );
}
