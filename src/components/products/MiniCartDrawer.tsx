"use client";

import clsx from "clsx";
import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Image } from "@/components/shared/Image";
import type { MiniCartLine } from "@/lib/types/shopify";
import type { ProductRecommendationUiItem } from "@/lib/shopify/domain/products";
import { MiniCartYouMayAlsoLikeFromPromise } from "./ProductRecommendationsFromPromise";

type MiniCartDrawerProps = {
  open: boolean;
  onClose: () => void;
  cartLines: MiniCartLine[];
  cartSubtotal: string;
  checkoutUrl: string | null;
  recommendationsPromise: Promise<ProductRecommendationUiItem[]>;
  onAddFromRecommendation: (variantId: string) => void;
  addingVariantId: string | null;
  onRemoveLine: (lineId: string) => void;
};

export function MiniCartDrawer({
  open,
  onClose,
  cartLines,
  cartSubtotal,
  checkoutUrl,
  recommendationsPromise,
  onAddFromRecommendation,
  addingVariantId,
  onRemoveLine,
}: MiniCartDrawerProps) {
  const tCart = useTranslations("cart");
  const tProduct = useTranslations("product");

  const drawerClass = clsx(
    "absolute inset-y-0 end-0 flex h-full w-full max-w-full sm:max-w-[420px] flex-col bg-card text-foreground shadow-xl transition-transform duration-300 ease-out p-4",
    open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
  );

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {open && (
        <div
          className="absolute inset-0 bg-black/40 pointer-events-auto"
          onClick={onClose}
          aria-label={tCart("closeMiniCartOverlay")}
        />
      )}
      <div className={clsx(drawerClass, "pointer-events-auto")}>
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-0.5">
            <p className="text-base font-semibold">{tCart("yourCart")}</p>
            <p className="text-sm text-muted-foreground">
              {cartLines.length} {tCart("items")}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-foreground" aria-label={tCart("closeMiniCart")}>
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 py-4">
          {cartLines.length === 0 ? (
            <p className="text-sm text-muted-foreground">{tCart("emptyMini")}</p>
          ) : (
            cartLines.map((line) => (
              <div key={line.id} className="flex gap-3 rounded-md border border-border bg-secondary/20 p-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted/60">
                  {line.imageUrl ? (
                    <Image
                      src={line.imageUrl}
                      alt={line.imageAlt ?? line.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-medium text-foreground">{line.title}</p>
                  <p className="text-xs text-muted-foreground">{line.variantTitle}</p>
                  <div className="mt-auto flex items-center justify-between text-sm text-foreground">
                    <span>
                      {tCart("qty")} {line.quantity}
                    </span>
                    <span>{line.price}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveLine(line.id)}
                  className="text-muted-foreground transition hover:text-foreground cursor-pointer"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border px-2 py-2 hidden md:block">
          <div className="mini-cart-yml text-sm">
            <Suspense fallback={<div className="h-32 w-full animate-pulse rounded-md bg-muted/60" />}>
              <MiniCartYouMayAlsoLikeFromPromise
                recommendationsPromise={recommendationsPromise}
                onAddToCart={onAddFromRecommendation}
                loadingVariantId={addingVariantId}
                title={tProduct("youMayAlsoLike")}
              />
            </Suspense>
          </div>
        </div>
        <div className="border-t border-border px-2 py-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-foreground">{tCart("subtotal")}</p>
            <p className="text-lg font-semibold text-foreground">{cartSubtotal || "—"}</p>
          </div>
          <p className="text-sm text-muted-foreground">{tCart("shippingTaxNote")}</p>
          <div className="space-y-2">
            <button
              type="button"
              disabled={!checkoutUrl}
              onClick={() => {
                if (checkoutUrl) window.location.href = checkoutUrl;
              }}
              className={clsx(
                "h-12 w-full rounded-md text-base font-semibold transition",
                checkoutUrl
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {tCart("checkout")}
            </button>
            <Link
              href="/cart"
              className="flex h-12 w-full items-center justify-center rounded-md border border-border bg-card text-base font-semibold text-foreground hover:bg-muted/40 transition"
            >
              {tCart("viewCart")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
