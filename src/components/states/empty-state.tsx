import { cn } from "@/lib/utils";

/** Shown when a list has nothing in it yet. Tells the person what to do next. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-dashed border-line bg-beige/40 px-6 py-14 text-center",
        className,
      )}
    >
      <h3 className="font-serif text-2xl text-charcoal">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-stone">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
