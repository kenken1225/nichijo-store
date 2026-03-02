"use client";

import { useState, useCallback } from "react";
import { formatPrice } from "@/lib/shopify/client";
import { useCart } from "@/contexts/CartContext";
import { useCountry } from "@/contexts/CountryContext";
import type { CartApiResponse, MiniCartLine, ParsedCart, ShopifyImage, ShopifyVariant } from "@/lib/types/shopify";
import { ProductDetail } from "./ProductDetail";
import { MiniCartDrawer } from "./MiniCartDrawer";

type RecommendationItem = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  secondaryImageUrl?: string | null;
  variantId?: string;
  available?: boolean;
};

type ProductPageWithDrawerProps = {
  product: {
    title: string;
    descriptionHtml: string;
    handle: string;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
  };
  recommendations: RecommendationItem[];
};

export function ProductPageWithDrawer({ product, recommendations }: ProductPageWithDrawerProps) {
  const { setItemCount } = useCart();
  const { country } = useCountry();
  const [cartLines, setCartLines] = useState<MiniCartLine[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null);
  const [selectedVariantImageUrl, setSelectedVariantImageUrl] = useState<string | null>(null);

  const parseCart = useCallback(
    (cart: CartApiResponse | null): ParsedCart => {
      const linesRaw = cart?.lines;
      const rawLines = Array.isArray(linesRaw)
        ? linesRaw
        : (linesRaw && "edges" in linesRaw && Array.isArray(linesRaw.edges)
            ? linesRaw.edges.map((e) => e.node)
            : []);
      const lines: MiniCartLine[] = rawLines.map((item) => {
        const merch = item?.merchandise;
        const image = merch?.product?.featuredImage ?? merch?.image;
        const price = merch?.price
          ? formatPrice(merch.price.amount, merch.price.currencyCode, country.numberLocale)
          : "";
        return {
          id: item?.id ?? "",
          quantity: item?.quantity ?? 1,
          title: merch?.product?.title ?? merch?.title ?? "",
          variantTitle: merch?.title ?? "",
          price,
          imageUrl: image?.url,
          imageAlt: image?.altText,
        };
      });
      const subtotalNode = cart?.cost?.subtotalAmount;
      const subtotal = subtotalNode
        ? formatPrice(subtotalNode.amount, subtotalNode.currencyCode, country.numberLocale)
        : "";
      return {
        lines,
        subtotal,
        checkoutUrl: cart?.checkoutUrl ?? null,
        totalQuantity: cart?.totalQuantity ?? 0,
      };
    },
    [country.numberLocale]
  );

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
      const rec = recommendations.find((r) => r.variantId === variantId);
      if (rec?.available === false) return;
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
        const parsed = parseCart(data.cart);
        handleAddedToCart(parsed);
      } catch (error) {
        console.error("Add recommendation to cart error:", error);
      } finally {
        setAddingVariantId(null);
      }
    },
    [recommendations, parseCart, handleAddedToCart]
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
        const parsed = parseCart(data.cart);
        setCartLines(parsed.lines);
        setCartSubtotal(parsed.subtotal);
        setCheckoutUrl(parsed.checkoutUrl);
        setItemCount(parsed.totalQuantity);
      } catch (error) {
        console.error(error);
      }
    },
    [parseCart, setItemCount]
  );

  return (
    <>
      <ProductDetail
        product={product}
        recommendations={recommendations}
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
        recommendations={recommendations}
        onAddFromRecommendation={(variantId) => handleAddToCartFromRecommendation(variantId)}
        addingVariantId={addingVariantId}
        onRemoveLine={handleRemoveLine}
      />
    </>
  );
}
