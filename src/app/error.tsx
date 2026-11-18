"use client";

import { Container } from "@/components/layout/container";
import { ErrorState } from "@/components/states/error-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-20">
      <ErrorState onRetry={reset} />
    </Container>
  );
}
