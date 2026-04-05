"use client";

import { useState, useCallback } from "react";
import { parseCartApiResponse } from "@/lib/cart/parseCartResponse";
import { useCart } from "@/contexts/CartContext";
import { useCountry } from "@/contexts/CountryContext";
import type { MiniCartLine, ParsedCart, ShopifyImage, ShopifyVariant } from "@/lib/types/shopify";
import type { ProductBadgeItem } from "@/components/shared/ProductBadges";
import type { ProductRecommendationUiItem } from "@/lib/shopify/domain/products";
import { ProductDetail } from "./ProductDetail";
import { MiniCartDrawer } from "./MiniCartDrawer";

type ProductPageWithDrawerProps = {
  product: {
    title: string;
    descriptionHtml: string;
    handle: string;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
  };
  headerBadges: ProductBadgeItem[];
  recommendationsPromise: Promise<ProductRecommendationUiItem[]>;
};

export function ProductPageWithDrawer({ product, headerBadges, recommendationsPromise }: ProductPageWithDrawerProps) {
  const { setItemCount } = useCart();
  const { country } = useCountry();
  const [cartLines, setCartLines] = useState<MiniCartLine[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null);
  const [selectedVariantImageUrl, setSelectedVariantImageUrl] = useState<string | null>(null);

  const handleAddedToCart = useCallback(
    (parsed: ParsedCart) => {
      setCartLines(parsed.lines);
      setCartSubtotal(parsed.subtotal);
      setCheckoutUrl(parsed.checkoutUrl);
      setItemCount(parsed.totalQuantity);
      setDrawerOpen(true);
    },
    [setItemCount]
  );

  const handleAddToCartFromRecommendation = useCallback(
    async (variantId: string, retryWithoutCartId = false) => {
      try {
        setAddingVariantId(variantId);
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchandiseId: variantId, quantity: 1 }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data?.error?.includes("does not exist") && !retryWithoutCartId) {
            setAddingVariantId(null);
            return handleAddToCartFromRecommendation(variantId, true);
          }
          throw new Error(data?.error ?? "Failed to add to cart");
        }
        const parsed = parseCartApiResponse(data.cart, country.numberLocale);
        handleAddedToCart(parsed);
      } catch (error) {
        console.error("Add recommendation to cart error:", error);
      } finally {
        setAddingVariantId(null);
      }
    },
    [country.numberLocale, handleAddedToCart]
  );

  const handleRemoveLine = useCallback(
    async (lineId: string) => {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineIds: [lineId] }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data?.error?.includes("does not exist")) {
            setCartLines([]);
            setCartSubtotal("");
            setCheckoutUrl(null);
            setItemCount(0);
            return;
          }
          throw new Error(data?.error ?? "Failed to remove item");
        }
        const parsed = parseCartApiResponse(data.cart, country.numberLocale);
        setCartLines(parsed.lines);
        setCartSubtotal(parsed.subtotal);
        setCheckoutUrl(parsed.checkoutUrl);
        setItemCount(parsed.totalQuantity);
      } catch (error) {
        console.error(error);
      }
    },
    [country.numberLocale, setItemCount]
  );

  return (
    <>
      <ProductDetail
        product={product}
        headerBadges={headerBadges}
        onAddedToCart={handleAddedToCart}
        selectedVariantImageUrl={selectedVariantImageUrl}
        onVariantImageChange={setSelectedVariantImageUrl}
      />
      <MiniCartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cartLines={cartLines}
        cartSubtotal={cartSubtotal}
        checkoutUrl={checkoutUrl}
        recommendationsPromise={recommendationsPromise}
        onAddFromRecommendation={(variantId) => handleAddToCartFromRecommendation(variantId)}
        addingVariantId={addingVariantId}
        onRemoveLine={handleRemoveLine}
      />
    </>
  );
}
