"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import { Image } from "@/components/shared/Image";

type Recommendation = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  secondaryImageUrl?: string | null;
  variantId?: string;
  available?: boolean;
};

type YouMayAlsoLikeProps = {
  items?: Recommendation[];
  showAddButton?: boolean;
  onAddToCart?: (variantId: string) => void;
  loadingVariantId?: string | null;
  variant?: "default" | "compact";
  title?: string;
  useRecentLocalStorage?: boolean;
  maxRecent?: number;
};

export function YouMayAlsoLike({
  items = [],
  showAddButton = false,
  onAddToCart,
  loadingVariantId = null,
  variant = "default",
  title = "You May Also Like",
  useRecentLocalStorage = false,
  maxRecent = 5,
}: YouMayAlsoLikeProps) {
  const [recentItems, setRecentItems] = useState<Recommendation[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

  useEffect(() => {
    if (!useRecentLocalStorage) return;
    if (typeof window === "undefined") return;

    const key = "recentProducts";
    let handles: string[] = [];
    try {
      handles = JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
    } catch {
      handles = [];
    }
    if (!handles.length) return;

    const abortController = new AbortController();
    let isCancelled = false;

    const fetchRecentProducts = async () => {
      const limited = handles.slice(0, maxRecent);
      const query = limited.join(",");
      setRecentLoading(true);

      try {
        const res = await fetch(`/api/recent-products?handles=${encodeURIComponent(query)}`, {
          signal: abortController.signal,
        });
        const data = await res.json();

        if (!isCancelled && Array.isArray(data?.items)) {
          setRecentItems(data.items);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to fetch recent products:", error);
        }
      } finally {
        if (!isCancelled) {
          setRecentLoading(false);
        }
      }
    };

    fetchRecentProducts();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [useRecentLocalStorage, maxRecent]);

  const sourceItems = items.length ? items : recentItems;
  // Keep API/recent order (assumed relevance) without re-sorting
  const limited = sourceItems.slice(0, 4);

  const shouldShowAdd = showAddButton && variant === "compact";

  const renderItem = (item: Recommendation) => {
    const isLoading = loadingVariantId === item.variantId;
    const addBtn =
      shouldShowAdd && item.variantId ? (
        <button
          type="button"
          disabled={!item.available || isLoading}
          onClick={() => onAddToCart?.(item.variantId!)}
          className={`rounded-md px-3 py-2 text-xs font-medium transition ${
            item.available && !isLoading
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Adding...
            </span>
          ) : item.available ? (
            "Add"
          ) : (
            "Sold"
          )}
        </button>
      ) : null;

    if (variant === "compact") {
      const hasSecondaryImage = !!item.secondaryImageUrl;
      return (
        <div className="flex flex-col items-start gap-3 rounded-md border border-border p-3">
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded bg-muted/60 flex-shrink-0">
              {item.imageUrl ? (
                <>
                  <Image
                    src={item.imageUrl ?? ""}
                    alt={item.imageAlt ?? item.title}
                    fill
                    sizes="150px"
                    className={`object-cover transition-opacity duration-300 ${
                      hasSecondaryImage ? "group-hover:opacity-0" : ""
                    }`}
                  />
                  {hasSecondaryImage && (
                    <Image
                      src={item.secondaryImageUrl ?? ""}
                      alt={item.imageAlt ?? item.title}
                      fill
                      sizes="150px"
                      className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )}
                </>
              ) : null}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.price}</p>
            </div>
          </div>
          {addBtn}
        </div>
      );
    }

    return (
      <div key={item.href} className="space-y-3">
        <ProductCard
          title={item.title}
          price={item.price}
          href={item.href}
          imageUrl={item.imageUrl}
          imageAlt={item.imageAlt}
          secondaryImageUrl={item.secondaryImageUrl}
        />
        {addBtn
          ? React.cloneElement(addBtn, {
              className: `w-full rounded-md px-4 py-2 text-sm font-medium transition ${
                item.available
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground line-through opacity-60 cursor-not-allowed"
              }`,
              children: item.available ? "Add to Cart" : "Sold Out",
            })
          : null}
      </div>
    );
  };

  if (variant === "compact") {
    if (recentLoading && sourceItems.length === 0) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="loading" />
        </div>
      );
    }
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
          {limited.map((item) => (
            <div key={item.href} className="min-w-[150px] snap-start">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-secondary/15 py-12">
      <Container className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">You May Also Like</h2>
        </div>
        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          {limited.map((item) => (
            <div key={item.href} className="min-w-[240px] snap-start">
              {renderItem(item)}
            </div>
          ))}
        </div>
        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {limited.map((item) => renderItem(item))}
        </div>
      </Container>
    </section>
  );
}
