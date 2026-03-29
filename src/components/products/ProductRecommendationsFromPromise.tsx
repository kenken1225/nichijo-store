"use client";

import { use } from "react";
import { YouMayAlsoLike } from "@/components/products/YouMayAlsoLike";
import type { ProductRecommendationUiItem } from "@/lib/shopify/domain/products";

export function YouMayAlsoLikeFromPromise({
  recommendationsPromise,
  title,
  showAddButton,
  useRecentLocalStorage,
  variant = "default",
}: {
  recommendationsPromise: Promise<ProductRecommendationUiItem[]>;
  title: string;
  showAddButton?: boolean;
  useRecentLocalStorage?: boolean;
  variant?: "default" | "compact";
}) {
  const items = use(recommendationsPromise);
  return (
    <YouMayAlsoLike
      items={items.length ? items : undefined}
      useRecentLocalStorage={useRecentLocalStorage}
      showAddButton={showAddButton}
      variant={variant}
      title={title}
    />
  );
}

export function MiniCartYouMayAlsoLikeFromPromise({
  recommendationsPromise,
  onAddToCart,
  loadingVariantId,
  title,
}: {
  recommendationsPromise: Promise<ProductRecommendationUiItem[]>;
  onAddToCart: (variantId: string) => void;
  loadingVariantId: string | null;
  title: string;
}) {
  const items = use(recommendationsPromise);
  return (
    <YouMayAlsoLike
      items={items}
      showAddButton
      onAddToCart={onAddToCart}
      loadingVariantId={loadingVariantId}
      variant="compact"
      title={title}
      useRecentLocalStorage
      maxRecent={4}
    />
  );
}
