import Link from "next/link";
function BrowseOtherPages() {
  return (
    <>
      <div className="space-y-3 text-center">
        <h2 className="text-2xl mb-10 font-bold text-foreground">This story inspired the products we create.</h2>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/collections/all"
            className="inline-flex h-12 min-w-[170px] items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Browse Products
          </Link>
          <Link
            href="/collections"
            className="inline-flex h-12 min-w-[170px] items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-sm transition hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View Collection
          </Link>
        </div>
      </div>
    </>
  );
}

export default BrowseOtherPages;
