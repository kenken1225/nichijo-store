import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CollectionPageInfo } from "@/lib/shopify/domain/collections";

type CollectionPaginationProps = {
  handle: string;
  page: number;
  pageInfo: CollectionPageInfo;
};

function hrefFor(handle: string, params: URLSearchParams) {
  const q = params.toString();
  return q ? (`/collections/${handle}?${q}` as const) : (`/collections/${handle}` as const);
}

export async function CollectionPagination({ handle, page, pageInfo }: CollectionPaginationProps) {
  const t = await getTranslations("collections");

  if (!pageInfo.hasNextPage && !pageInfo.hasPreviousPage && page <= 1) {
    return null;
  }

  const nextParams = new URLSearchParams();
  if (pageInfo.hasNextPage && pageInfo.endCursor) {
    nextParams.set("after", pageInfo.endCursor);
    nextParams.set("p", String(page + 1));
  }
  const nextHref = nextParams.toString() ? hrefFor(handle, nextParams) : null;

  const prevParams = new URLSearchParams();
  if (pageInfo.hasPreviousPage && pageInfo.startCursor) {
    prevParams.set("before", pageInfo.startCursor);
    prevParams.set("p", String(Math.max(1, page - 1)));
  }
  const prevHref = prevParams.toString() ? hrefFor(handle, prevParams) : null;

  const firstHref = hrefFor(handle, new URLSearchParams());

  const linkClass = "pb-1 text-foreground/80 transition hover:text-foreground";
  const activeClass = "border-b-2 border-foreground pb-1 font-medium text-foreground";
  const mutedClass = "pb-1 text-muted-foreground";

  return (
    <nav className="mt-12 w-full" aria-label={t("paginationNav")}>
      <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-8 md:gap-10">
        {page > 1 && prevHref ? (
          <Link
            href={prevHref}
            className="mb-0.5 text-muted-foreground transition hover:text-foreground"
            aria-label={t("paginationPrev")}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        ) : (
          <span className="mb-0.5 w-5" aria-hidden />
        )}

        <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-8 md:gap-10 text-sm sm:text-base">
          {page === 1 ? (
            <span className={activeClass}>1</span>
          ) : (
            <Link href={firstHref} className={linkClass}>
              1
            </Link>
          )}

          {page > 2 ? <span className={mutedClass}>…</span> : null}

          {page > 2 && prevHref ? (
            <Link href={prevHref} className={linkClass}>
              {page - 1}
            </Link>
          ) : null}

          {page > 1 ? <span className={activeClass}>{page}</span> : null}

          {pageInfo.hasNextPage && nextHref ? (
            <Link href={nextHref} className={linkClass}>
              {page + 1}
            </Link>
          ) : null}

          {pageInfo.hasNextPage ? <span className={mutedClass}>…</span> : null}
        </div>

        {nextHref ? (
          <Link
            href={nextHref}
            className="mb-0.5 text-muted-foreground transition hover:text-foreground"
            aria-label={t("paginationNext")}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        ) : (
          <span className="mb-0.5 w-5" aria-hidden />
        )}
      </div>
      <div className="mt-3 h-px w-full bg-border" />
    </nav>
  );
}
