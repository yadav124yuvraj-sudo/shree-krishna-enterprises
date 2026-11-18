import { Container } from "@/components/layout/container";
import { CardGridSkeleton, Skeleton } from "@/components/states/loading-skeleton";

export default function Loading() {
  return (
    <Container className="py-16">
      <Skeleton className="h-10 w-2/3 max-w-xl" />
      <div className="mt-10">
        <CardGridSkeleton />
      </div>
    </Container>
  );
}
