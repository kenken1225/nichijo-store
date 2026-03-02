"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/shopify/client";
import type { ShopifyVariant } from "@/lib/types/shopify";
import { ProductPrice } from "./ProductPrice";
import { useCart } from "@/contexts/CartContext";
import { useCountry } from "@/contexts/CountryContext";
import type { ParsedCart } from "@/lib/types/shopify";

type RecommendationItem = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  variantId?: string;
  available?: boolean;
};

type CartLine = {
  id: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type ProductActionsProps = {
  title: string;
  descriptionHtml: string;
  variants: ShopifyVariant[];
  recommendations?: RecommendationItem[];
  onAddedToCart?: (parsed: ParsedCart) => void;
  onVariantImageChange?: (imageUrl: string | null) => void;
};

export function ProductActions({
  title,
  descriptionHtml,
  variants,
  recommendations = [],
  onAddedToCart,
  onVariantImageChange,
}: ProductActionsProps) {
  const tProduct = useTranslations("product");
  const { setItemCount } = useCart();
  const { country } = useCountry();
  const initialVariant = variants.find((v) => v.availableForSale !== false) ?? variants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialVariant?.selectedOptions?.forEach((o) => {
      map[o.name] = o.value;
    });
    return map;
  });
  const [loading, setLoading] = useState(false);

  const optionValues = useMemo(() => {
    const map = new Map<string, Set<string>>();
    variants.forEach((v) => {
      v.selectedOptions?.forEach((o) => {
        if (!map.has(o.name)) map.set(o.name, new Set());
        map.get(o.name)!.add(o.value);
      });
    });
    return map;
  }, [variants]);

  useEffect(() => {
    const nextVariant = variants.find((v) => v.availableForSale !== false) ?? variants[0] ?? null;
    setSelectedVariant(nextVariant);
    const map: Record<string, string> = {};
    nextVariant?.selectedOptions?.forEach((o) => {
      map[o.name] = o.value;
    });
    setSelections(map);
  }, [variants]);

  useEffect(() => {
    onVariantImageChange?.(selectedVariant?.image?.url ?? null);
  }, [selectedVariant, onVariantImageChange]);

  const displayPrice = useMemo(() => {
    if (!selectedVariant?.price) return "";
    return formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode, country.numberLocale);
  }, [selectedVariant, country.numberLocale]);

  const variantMatches = (variant: ShopifyVariant, nextSelections: Record<string, string>) => {
    const opts = variant.selectedOptions ?? [];
    return opts.every((o) => {
      const chosen = nextSelections[o.name];
      return !chosen || chosen === o.value;
    });
  };

  const hasAvailableVariantFor = (nextSelections: Record<string, string>) => {
    return variants.some((v) => v.availableForSale !== false && variantMatches(v, nextSelections));
  };

  const handleSelectOption = (name: string, value: string) => {
    const next = { ...selections, [name]: value };
    const match = variants.find((v) => v.availableForSale !== false && variantMatches(v, next));
    const pick = match ?? selectedVariant ?? variants[0] ?? null;
    setSelectedVariant(pick);
    const map: Record<string, string> = {};
    pick?.selectedOptions?.forEach((o) => {
      map[o.name] = o.value;
    });
    setSelections(map);
    setErrorMessage("");
    onVariantImageChange?.(pick?.image?.url ?? null);
  };

  const isOptionUnavailable = (name: string, value: string) => {
    const next = { ...selections, [name]: value };
    return !hasAvailableVariantFor(next);
  };

  type CartResponse = { lines?: any[]; cost?: any; checkoutUrl?: string; totalQuantity?: number };

  const parseCart = (
    cart: CartResponse | null
  ): { lines: CartLine[]; subtotal: string; checkoutUrl: string | null; totalQuantity: number } => {
    const rawLines = Array.isArray(cart?.lines) ? cart.lines : [];
    const lines = rawLines.map((item) => {
      const merch = item?.merchandise;
      const image = merch?.product?.featuredImage ?? merch?.image;
      const price = merch?.price ? formatPrice(merch.price.amount, merch.price.currencyCode, country.numberLocale) : "";
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
    const checkout = cart?.checkoutUrl ?? null;
    const totalQuantity = cart?.totalQuantity ?? 0;
    return { lines, subtotal, checkoutUrl: checkout, totalQuantity };
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
      const parsed = parseCart(data.cart);
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
                      onClick={() => !unavailable && handleSelectOption(name, value)}
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
