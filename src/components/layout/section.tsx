import { cn } from "@/lib/utils";
import { Container } from "./container";

export function Section({
  className,
  tone = "default",
  id,
  children,
}: {
  className?: string;
  tone?: "default" | "beige" | "charcoal";
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        tone === "beige" && "bg-beige",
        tone === "charcoal" && "bg-charcoal text-warm-white",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
