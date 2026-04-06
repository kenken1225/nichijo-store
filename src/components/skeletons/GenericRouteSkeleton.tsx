export function GenericRouteSkeleton() {
  return (
    <div className="bg-background animate-pulse">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-10 max-w-3xl space-y-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-10 max-w-md w-2/3 rounded bg-muted" />
          <div className="h-4 max-w-xl w-full rounded bg-muted" />
          <div className="h-4 max-w-lg w-5/6 rounded bg-muted" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-full rounded bg-muted/80" />
          ))}
        </div>
      </div>
    </div>
  );
}
