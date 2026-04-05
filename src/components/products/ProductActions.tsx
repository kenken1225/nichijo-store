"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/shopify/client";
import { parseCartApiResponse } from "@/lib/cart/parseCartResponse";
import type { ParsedCart, ShopifyVariant } from "@/lib/types/shopify";
import { ProductPrice } from "./ProductPrice";
import { useCart } from "@/contexts/CartContext";
import { useCountry } from "@/contexts/CountryContext";
import { ProductBadges, type ProductBadgeItem } from "@/components/shared/ProductBadges";
import { useProductVariantSelection } from "./useProductVariantSelection";

type ProductActionsProps = {
  title: string;
  descriptionHtml: string;
  variants: ShopifyVariant[];
  headerBadges: ProductBadgeItem[];
  onAddedToCart?: (parsed: ParsedCart) => void;
  onVariantImageChange?: (imageUrl: string | null) => void;
};

export function ProductActions({
  title,
  descriptionHtml,
  variants,
  headerBadges,
  onAddedToCart,
  onVariantImageChange,
}: ProductActionsProps) {
  const tProduct = useTranslations("product");
  const { setItemCount } = useCart();
  const { country } = useCountry();

  const { selectedVariant, selections, optionValues, handleSelectOption, isOptionUnavailable } =
    useProductVariantSelection({ variants, onVariantImageChange });

  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const displayPrice = useMemo(() => {
    if (!selectedVariant?.price) return "";
    return formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode, country.numberLocale);
  }, [selectedVariant, country.numberLocale]);

  const onSelectOption = (name: string, value: string) => {
    setErrorMessage("");
    handleSelectOption(name, value);
  };

  const handleAddToCart = async (retryWithoutCartId = false) => {
    if (!selectedVariant?.id) return;
    const avail = selectedVariant.quantityAvailable;
    const availableForSale = selectedVariant.availableForSale !== false;
    if (!availableForSale) {
      setErrorMessage(tProduct("notAvailable"));
      return;
    }
    if (typeof avail === "number" && avail > 0 && quantity > avail) {
      setErrorMessage(tProduct("exceedsInventory"));
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: selectedVariant.id, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.error?.includes("does not exist") && !retryWithoutCartId) {
          setLoading(false);
          return handleAddToCart(true);
        }
        throw new Error(data?.error ?? "Failed to add to cart");
      }
      const parsed = parseCartApiResponse(data.cart, country.numberLocale);
      setItemCount(parsed.totalQuantity);
      onAddedToCart?.(parsed);
    } catch {
      setErrorMessage(tProduct("lowInventory"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 mt-5">
        <div className="space-y-2">
          <ProductBadges badges={headerBadges} variant="inline" />
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <ProductPrice value={displayPrice} />
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </div>
        {Array.from(optionValues.keys()).map((name) => {
          const values = Array.from(optionValues.get(name) ?? []);
          return (
            <div key={name} className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{name}</p>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const unavailable = isOptionUnavailable(name, value);
                  const isSelected = selections[name] === value;
                  return (
                    <button
                      key={`${name}-${value}`}
                      type="button"
                      onClick={() => !unavailable && onSelectOption(name, value)}
                      disabled={unavailable}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        isSelected
                          ? "border-primary bg-primary text-background"
                          : "border-border bg-card text-foreground"
                      } ${
                        unavailable
                          ? "line-through opacity-60 cursor-not-allowed"
                          : "hover:border-foreground/70 hover:shadow-sm"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="space-y-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{tProduct("quantity")}</p>
            <div className="inline-flex h-12 w-44 items-center justify-between rounded-md border border-border bg-card">
              <button
                type="button"
                className="h-full w-12 text-lg text-foreground hover:bg-muted/60"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={tProduct("decreaseQty")}
              >
                −
              </button>
              <span className="text-base font-medium text-foreground">{quantity}</span>
              <button
                type="button"
                className="h-full w-12 text-lg text-foreground hover:bg-muted/60"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label={tProduct("increaseQty")}
              >
                +
              </button>
            </div>
          </div>
          <Button
            className="h-12 w-full rounded-lg bg-primary text-primary-foreground text-base font-semibold hover:opacity-90"
            onClick={() => handleAddToCart()}
            disabled={!selectedVariant?.availableForSale || loading}
          >
            {selectedVariant?.availableForSale ? (
              loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {tProduct("adding")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" aria-hidden />
                  {tProduct("addToCart")}
                </span>
              )
            ) : (
              tProduct("outOfStock")
            )}
          </Button>
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          <p className="text-xs text-muted-foreground">{tProduct("shipsIn")}</p>
        </div>
      </div>
    </>
  );
}
