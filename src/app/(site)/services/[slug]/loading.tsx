import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/states/loading-skeleton";

export default function ServiceDetailLoading() {
  return (
    <div>
      <div className="border-b border-line bg-beige/60 py-10 sm:py-14">
        <Container>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-6 w-32" />
          <Skeleton className="mt-3 h-10 w-2/3 max-w-xl" />
          <Skeleton className="mt-4 h-5 w-1/2 max-w-md" />
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-8">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </Container>
    </div>
  );
}
