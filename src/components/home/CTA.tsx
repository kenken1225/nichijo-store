export function CTA() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card px-6 py-8 text-center shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-foreground">Stay in the loop</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Get product drops and blog updates delivered to your inbox.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full max-w-xs rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground"
          />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}



