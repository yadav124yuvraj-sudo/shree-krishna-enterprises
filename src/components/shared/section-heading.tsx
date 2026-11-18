export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold-deep">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-stone">{description}</p> : null}
    </div>
  );
}
