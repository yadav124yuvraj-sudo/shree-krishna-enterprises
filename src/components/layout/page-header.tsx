import { Container } from "./container";

/** Heading block used at the top of every inner page. */
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-line bg-beige/60">
      <Container className="py-14 sm:py-20">
        <h1 className="max-w-3xl font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
