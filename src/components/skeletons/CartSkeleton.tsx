export function CartSkeleton() {
  return (
    <div className="grid gap-7 lg:grid-cols-2 animate-pulse">
      <div className="space-y-6">
        <div className="divide-y divide-border border border-border rounded-lg bg-card">
          {[1, 2].map((i) => (
            <div key={i} className="grid grid-cols-[auto,80px] items-center gap-4 px-6 py-4 md:grid-cols-3">
              <div className="h-[120px] w-[120px] rounded bg-muted" />

              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-10 w-28 bg-muted rounded mt-2" />
              </div>

              <div className="h-4 w-16 bg-muted rounded ms-auto" />
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-lg p-6 space-y-4 bg-[#C77D58]/30">
        <div className="h-6 w-36 bg-muted/50 rounded" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-muted/50 rounded" />
            <div className="h-4 w-16 bg-muted/50 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-muted/50 rounded" />
            <div className="h-4 w-32 bg-muted/50 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-12 bg-muted/50 rounded" />
            <div className="h-4 w-32 bg-muted/50 rounded" />
          </div>
        </div>
        <div className="border-t border-white/40 pt-3 flex justify-between">
          <div className="h-4 w-12 bg-muted/50 rounded" />
          <div className="h-4 w-16 bg-muted/50 rounded" />
        </div>
        <div className="h-12 w-full bg-muted/50 rounded" />
        <div className="h-12 w-full bg-muted/50 rounded" />
      </aside>
    </div>
  );
}
