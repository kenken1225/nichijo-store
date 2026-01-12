"use client";

import { useMemo, useState, useEffect } from "react";
import type { CollectionProduct } from "@/lib/shopify/collections";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";
import { AvailabilityFilter } from "./AvailabilityFilter";
import { SortSelect } from "./SortSelect";
import { ActiveFilters } from "./ActiveFilters";
import { CollectionProductGrid } from "../CollectionProductGrid";
import { useMediaQuery } from "@/lib/useMediaQuery";

type SortValue = "featured" | "price-asc" | "price-desc" | "newest";

type CollectionFiltersProps = {
  products: CollectionProduct[];
};

export function CollectionFilters({ products }: CollectionFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceKey, setPriceKey] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortValue>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const priceOptions = useMemo(
    () => [
      { key: "under-30", label: "Under $30", min: null, max: 30 },
      { key: "30-60", label: "$30 - $60", min: 30, max: 60 },
      { key: "60-100", label: "$60 - $100", min: 60, max: 100 },
      { key: "over-100", label: "Over $100", min: 100, max: null },
    ],
    []
  );

  const filtered = useMemo(() => {
    const selectedPrice = priceOptions.find((p) => p.key === priceKey) ?? null;
    const min = selectedPrice?.min ?? null;
    const max = selectedPrice?.max ?? null;

    let next = products.filter((p) => {
      // category
      if (selectedCategory && p.category !== selectedCategory) return false;

      // price
      const priceAmount = p.priceAmount ?? (p.price ? Number(p.price.amount) : undefined);
      if (min !== null && typeof priceAmount === "number" && priceAmount < min) return false;
      if (max !== null && typeof priceAmount === "number" && priceAmount >= max) return false;

      // in-stock
      if (inStockOnly && p.available === false) return false;

      return true;
    });

    switch (sort) {
      case "price-asc":
        next = [...next].sort((a, b) => (a.priceAmount ?? Infinity) - (b.priceAmount ?? Infinity));
        break;
      case "price-desc":
        next = [...next].sort((a, b) => (b.priceAmount ?? -Infinity) - (a.priceAmount ?? -Infinity));
        break;
      case "newest":
        next = [...next].sort((a, b) => {
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
  }, [products, selectedCategory, priceKey, inStockOnly, sort, priceOptions]);

  const clearAll = () => {
    setSelectedCategory(null);
    setPriceKey(null);
    setInStockOnly(false);
    setSort("featured");
  };

  const priceLabel = priceKey ? priceOptions.find((p) => p.key === priceKey)?.label ?? null : null;

  const filtersContent = (
    <div className="space-y-6">
      <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <PriceFilter options={priceOptions} value={priceKey} onChange={setPriceKey} />
      <AvailabilityFilter inStockOnly={inStockOnly} onToggle={setInStockOnly} />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Mobile controls */}
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-sm text-foreground">{filtered.length} items</p>
        <div className="flex items-center gap-2">
          <SortSelect value={sort} onChange={setSort} />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:border-foreground/60"
          >
            Filters
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block space-y-6 rounded-lg border border-border p-4 ">{filtersContent}</div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-base font-semibold text-foreground">Products ({filtered.length})</p>
              <ActiveFilters
                selectedCategory={selectedCategory}
                priceLabel={priceLabel}
                inStockOnly={inStockOnly}
                onClearCategory={() => setSelectedCategory(null)}
                onClearPrice={() => setPriceKey(null)}
                onClearInStock={() => setInStockOnly(false)}
                onClearAll={clearAll}
              />
            </div>

            <div className="hidden lg:flex">
              <SortSelect value={sort} onChange={setSort} />
            </div>
          </div>

          <CollectionProductGrid products={filtered} />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {!isDesktop && (
        <>
          {mobileFiltersOpen ? (
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          ) : null}
          <div
            className={`fixed inset-x-0 bottom-0 z-50 transform bg-card shadow-2xl transition-transform duration-300 ${
              mobileFiltersOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-base font-semibold text-foreground">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-4 py-4 space-y-6">{filtersContent}</div>
            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-md bg-[#c47a57] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
              >
                Show Results ({filtered.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
