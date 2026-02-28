"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/shopify";
import type { ShopifyVariant } from "@/lib/types/shopify";
import { YouMayAlsoLike } from "./YouMayAlsoLike";
import { ProductPrice } from "./ProductPrice";
import { useCart } from "@/contexts/CartContext";
import { useCountry } from "@/contexts/CountryContext";

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
};

export function ProductActions({ title, descriptionHtml, variants, recommendations = [] }: ProductActionsProps) {
  const tProduct = useTranslations("product");
  const tCart = useTranslations("cart");
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
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null);

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
  };

  const isOptionUnavailable = (name: string, value: string) => {
    const next = { ...selections, [name]: value };
    return !hasAvailableVariantFor(next);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const clearInvalidCart = () => {
    setCartId(null);
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
        // If the cart does not exist, clear the cartId and retry
        if (data?.error?.includes("does not exist") && !retryWithoutCartId) {
          clearInvalidCart();
          setLoading(false);
          return handleAddToCart(true);
        }
        throw new Error(data?.error ?? "Failed to add to cart");
      }
      setCartId(data.cartId);
      const parsed = parseCart(data.cart);
      setCartLines(parsed.lines);
      setCartSubtotal(parsed.subtotal);
      setCheckoutUrl(parsed.checkoutUrl);
      setItemCount(parsed.totalQuantity);
      setDrawerOpen(true);
    } catch {
      setErrorMessage(tProduct("lowInventory"));
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => setDrawerOpen(false);

  const drawerClass = clsx(
    "absolute inset-y-0 end-0 flex h-full w-full max-w-full sm:max-w-[420px] flex-col bg-card text-foreground shadow-xl transition-transform duration-300 ease-out p-4",
    drawerOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
  );

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

      <div className="fixed inset-0 z-40 pointer-events-none">
        {drawerOpen && (
          <div
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={closeDrawer}
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
            <button type="button" onClick={closeDrawer} className="text-foreground" aria-label={tCart("closeMiniCart")}>
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 py-4">
            {cartLines.length === 0 ? (
              <p className="text-sm text-muted-foreground">{tCart("emptyMini")}</p>
            ) : (
              cartLines.map((line) => (
                <div key={line.id} className="flex gap-3 rounded-md border border-border bg-secondary/20 p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted/60">
                    {line.imageUrl ? (
                      <img
                        src={line.imageUrl}
                        alt={line.imageAlt ?? line.title}
                        className="h-full w-full object-cover"
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
                    onClick={() => handleRemoveLine(line.id)}
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
              <YouMayAlsoLike
                items={recommendations}
                showAddButton
                onAddToCart={handleAddToCartFromRecommendation}
                loadingVariantId={addingVariantId}
                variant="compact"
                title={tProduct("youMayAlsoLike")}
                useRecentLocalStorage
                maxRecent={4}
              />
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
    </>
  );

  async function handleAddToCartFromRecommendation(variantId: string, retryWithoutCartId = false) {
    const rec = recommendations.find((r) => r.variantId === variantId);
    if (rec?.available === false) {
      setErrorMessage(tProduct("notAvailable"));
      return;
    }
    try {
      setAddingVariantId(variantId);
      setErrorMessage("");
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: variantId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        // if cart does not exist, clear cart content and retry.
        if (data?.error?.includes("does not exist") && !retryWithoutCartId) {
          clearInvalidCart();
          setAddingVariantId(null);
          return handleAddToCartFromRecommendation(variantId, true);
        }
        throw new Error(data?.error ?? "Failed to add to cart");
      }
      setCartId(data.cartId);
      const parsed = parseCart(data.cart);
      setCartLines(parsed.lines);
      setCartSubtotal(parsed.subtotal);
      setCheckoutUrl(parsed.checkoutUrl);
      setItemCount(parsed.totalQuantity);
      setDrawerOpen(true);
    } catch (error) {
      // Output error message and show message about inventory info.
      console.error("Add recommendation to cart error:", error instanceof Error ? error.message : error);
      setErrorMessage(tProduct("lowInventory"));
    } finally {
      setAddingVariantId(null);
    }
  }

  async function handleRemoveLine(lineId: string) {
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineIds: [lineId] }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If the cart does not exist, clear the local state
        if (data?.error?.includes("does not exist")) {
          clearInvalidCart();
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
    } finally {
      setLoading(false);
    }
  }
}
