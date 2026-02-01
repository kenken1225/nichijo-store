import { Container } from "@/components/layout/Container";

export function SearchResultsSkeleton() {
  return (
    <div className="bg-background animate-pulse">
      {/* Header Section */}
      <section className="bg-secondary/30 py-8 sm:py-10">
        <Container className="space-y-3 text-center">
          <div className="h-4 w-20 bg-muted rounded mx-auto" />
          <div className="h-8 w-48 bg-muted rounded mx-auto" />
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
          <div className="max-w-md mx-auto mt-6">
            <div className="h-12 w-full bg-muted rounded-full" />
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12">
        <Container className="space-y-12">
          {/* Products Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/5] bg-muted rounded-lg" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Articles Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/3] bg-muted rounded-lg" />
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
