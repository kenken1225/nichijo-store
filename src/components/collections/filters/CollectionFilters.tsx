"use client";

import { useMemo, useState, useTransition } from "react";
import type { CollectionFilterFacet, CollectionProduct } from "@/lib/shopify/domain/collections";
import { SortSelect } from "./SortSelect";
import type { SortValue } from "./SortSelect";
import { ActiveFilters } from "./ActiveFilters";
import { CollectionProductGrid } from "../CollectionProductGrid";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  chipsForAppliedFilters,
  encodeCollectionFiltersParam,
  filterInputKey,
  removeFilterByInputKey,
  selectFacetFilterValue,
} from "@/lib/shopify/domain/collection-filters";

type CollectionFiltersProps = {
  filterFacets: CollectionFilterFacet[];
  appliedFilters: unknown[];
  products: CollectionProduct[];
};

function FacetBlock({
  facet,
  appliedFilters,
  onSelectValue,
}: {
  facet: CollectionFilterFacet;
  appliedFilters: unknown[];
  onSelectValue: (facetId: string, valueId: string) => void;
}) {
  const selectedKeys = new Set(appliedFilters.map((f) => filterInputKey(f)));

  return (
    <div className="space-y-3">
      <p className="border-b border-primary/20 pb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {facet.label}
      </p>
      <div
        className={clsx(
          "flex flex-col gap-2",
          facet.values.length > 7 && "max-h-60 overflow-y-auto overscroll-contain pe-1"
        )}
      >
        {facet.values.map((v) => {
          const active = selectedKeys.has(filterInputKey(v.input));
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectValue(facet.id, v.id)}
              className={clsx(
                "w-full rounded-lg border px-3 py-2.5 text-start text-sm transition-all duration-200",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                  : "border-border/80 bg-card text-foreground shadow-sm hover:border-primary/35 hover:bg-secondary/50"
              )}
            >
              <span className="font-medium">{v.label}</span>
              {typeof v.count === "number" ? (
                <span
                  className={clsx(
                    "ms-2 tabular-nums text-xs",
                    active ? "text-primary-foreground/85" : "text-muted-foreground"
                  )}
                >
                  ({v.count})
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CollectionFilters({
  filterFacets,
  appliedFilters,
  products,
}: CollectionFiltersProps) {
  const t = useTranslations("collections");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortValue>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFilterNavPending, startFilterNavTransition] = useTransition();

  const sortedProducts = useMemo(() => {
    const next = [...products];
    switch (sort) {
      case "price-asc":
        next.sort((a, b) => (a.priceAmount ?? Infinity) - (b.priceAmount ?? Infinity));
        break;
      case "price-desc":
        next.sort((a, b) => (b.priceAmount ?? -Infinity) - (a.priceAmount ?? -Infinity));
        break;
      case "newest":
        next.sort((a, b) => {
          const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
          const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
          return bDate - aDate;
        });
        break;
      case "featured":
      default:
        break;
    }
    return next;
  }, [products, sort]);

  const chips = useMemo(() => chipsForAppliedFilters(filterFacets, appliedFilters), [filterFacets, appliedFilters]);

  const navigateWithFilters = (next: unknown[]) => {
    startFilterNavTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("after");
      params.delete("before");
      params.delete("p");
      if (next.length) params.set("cf", encodeCollectionFiltersParam(next));
      else params.delete("cf");
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    });
  };

  const onSelectValue = (facetId: string, valueId: string) => {
    const next = selectFacetFilterValue(filterFacets, facetId, valueId, appliedFilters);
    navigateWithFilters(next);
    setMobileFiltersOpen(false);
  };

  const onClearChip = (inputKey: string) => {
    navigateWithFilters(removeFilterByInputKey(appliedFilters, inputKey));
  };

  const onClearAllFilters = () => navigateWithFilters([]);

  const filtersContent =
    filterFacets.length > 0 ? (
      <div className="space-y-8">
        {filterFacets.map((facet) => (
          <FacetBlock
            key={facet.id}
            facet={facet}
            appliedFilters={appliedFilters}
            onSelectValue={onSelectValue}
          />
        ))}
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{sortedProducts.length}</span> {t("items")}
        </p>
        <div className="flex items-center gap-2">
          <SortSelect value={sort} onChange={setSort} />
          {filterFacets.length > 0 ? (
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-secondary/40"
            >
              {t("filters")}
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative">
        <div
          className={clsx(
            "grid gap-8 lg:grid-cols-[280px_1fr] transition-opacity duration-200",
            isFilterNavPending && "pointer-events-none opacity-55"
          )}
          aria-busy={isFilterNavPending}
        >
          {filterFacets.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6 rounded-xl border border-border/90 bg-secondary/35 p-5 shadow-sm ring-1 ring-border/40 backdrop-blur-sm">
                {filtersContent}
              </div>
            </aside>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">
                  {t("products", { count: sortedProducts.length })}
                </p>
                <ActiveFilters
                  chips={chips}
                  onClearChip={onClearChip}
                  onClearAll={onClearAllFilters}
                />
              </div>

              <div className="hidden lg:flex">
                <SortSelect value={sort} onChange={setSort} />
              </div>
            </div>

            <CollectionProductGrid products={sortedProducts} />
          </div>
        </div>

        {isFilterNavPending ? (
          <div
            className="pointer-events-none absolute start-1/2 top-0 z-10 -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <span className="inline-flex items-center rounded-full border border-border bg-card/95 px-4 py-2 text-sm font-medium text-foreground shadow-md ring-1 ring-primary/15">
              {t("filterResultsLoading")}
            </span>
          </div>
        ) : null}
      </div>

      {/* lg:hidden: same DOM on server & client — avoids hydration mismatch from useMediaQuery */}
      {filterFacets.length > 0 ? (
        <div className="lg:hidden">
          {mobileFiltersOpen ? (
            <button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[1px]"
              onClick={() => setMobileFiltersOpen(false)}
            />
          ) : null}
          <div
            className={clsx(
              "fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] flex flex-col rounded-t-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-border/50 transition-transform duration-300 ease-out",
              mobileFiltersOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-secondary/30 px-4 py-3">
              <p className="text-base font-semibold text-foreground">{t("filters")}</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{filtersContent}</div>
            <div className="shrink-0 border-t border-border/80 bg-secondary/20 p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                {t("showResults", { count: sortedProducts.length })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
