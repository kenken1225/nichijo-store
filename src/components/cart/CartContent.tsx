"use client";

import { CartWithLines } from "@/lib/shopify/cart";
import { formatPrice } from "@/lib/shopify";
import Image from "next/image";
import { Globe2, RotateCcw, ShieldCheck, XIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useCountry } from "@/contexts/CountryContext";
import { useTranslations } from "next-intl";

type CartContentProps = {
  cartId: string | null;
  initialCart: CartWithLines | null;
};

export function CartContent({ cartId, initialCart }: CartContentProps) {
  const t = useTranslations("cart");
  const { setItemCount } = useCart();
  const { country } = useCountry();
  const [cart, setCart] = useState<CartWithLines | null>(initialCart);
  const [loadingLineId, setLoadingLineId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(initialCart?.checkoutUrl ?? null);
  const [cartIsEmpty, setCartIsEmpty] = useState(!(initialCart?.lines?.length ?? 0));

  const handleQuantityChange = async (cartId: string, lineId: string, nextQuantity: number) => {
    if (!cartId || !lineId) return;
    if (nextQuantity < 1) {
      try {
        setLoadingLineId(lineId);
        setError(null);
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId, lineIds: [lineId] }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? t("removeFailed"));
          return;
        }
        checkCartIsEmpty(data?.cart?.lines?.length ?? 0);
        setCart(data?.cart);
        setCheckoutUrl(data?.cart?.checkoutUrl ?? null);
        setItemCount(data?.cart?.totalQuantity ?? 0);
      } catch (error) {
        setError(error instanceof Error ? error.message : t("unknownError"));
      } finally {
        setLoadingLineId(null);
      }
      return;
    }

    try {
      setLoadingLineId(lineId);
      setError(null);
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          lineId,
          quantity: nextQuantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? t("qtyChangeFailed"));
        return;
      }
      checkCartIsEmpty(data?.cart?.lines?.length ?? 0);
      setCart(data?.cart);
      setCheckoutUrl(data?.cart?.checkoutUrl ?? null);
      setItemCount(data?.cart?.totalQuantity ?? 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("unknownError"));
    } finally {
      setLoadingLineId(null);
    }
  };

  const checkCartIsEmpty = (cartLength: number | null) => {
    if (cartLength === 0) {
      setCartIsEmpty(true);
    } else {
      setCartIsEmpty(false);
    }
  };

  const zeroPrice = formatPrice("0", country.currency, country.numberLocale);
  const subtotal = cart?.cost?.subtotalAmount
    ? formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode, country.numberLocale)
    : zeroPrice;
  const total = cart?.cost?.totalAmount
    ? formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode, country.numberLocale)
    : zeroPrice;

  return (
    <>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!cartIsEmpty ? (
        <div className="grid gap-7 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="divide-y divide-border border border-border rounded-lg bg-card">
              {cart?.lines.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto,80px] items-center gap-4 px-6 py-4 md:grid-cols-3 relative"
                >
                  <div className="h-[120px] w-[120px] overflow-hidden rounded bg-muted/60 flex items-center justify-center">
                    <Image
                      src={item.merchandise.product.featuredImage?.url ?? "/images/placeholder.png"}
                      alt={item.merchandise.product.title}
                      width={120}
                      height={120}
                    />
                  </div>
                  <div>
                    <div className="text-sm text-foreground font-medium">{item.merchandise.product.title}</div>
                    {item.merchandise.selectedOptions?.length ? (
                      <div className="text-[11px] text-muted-foreground mt-1 space-y-0.5">
                        {item.merchandise.selectedOptions.map((opt) => (
                          <div key={`${opt.name}-${opt.value}`}>
                            {opt.name}: {opt.value}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-2 flex align-center justify-between items-center gap-3 text-sm rounded border border-border p-1">
                      <button
                        className="h-8 w-8 text-muted-foreground disabled:opacity-50"
                        onClick={() => handleQuantityChange(cartId ?? "", item.id, item.quantity - 1)}
                        disabled={loadingLineId === item.id}
                      >
                        -
                      </button>
                      {loadingLineId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <span className="text-foreground">{item.quantity}</span>
                      )}
                      <button
                        className="h-8 w-8 text-muted-foreground disabled:opacity-50 cursor-pointer"
                        onClick={() => handleQuantityChange(cartId ?? "", item.id, item.quantity + 1)}
                        disabled={loadingLineId === item.id}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-end text-sm text-muted-foreground md:text-end">
                    {formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode || "USD", country.numberLocale)}
                  </div>
                  <div className="absolute top-5 -translate-y-1/2 end-5">
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => handleQuantityChange(cartId ?? "", item.id, 0)}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg p-6 space-y-4 bg-[#C77D58]/30">
            <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between opacity-90">
                <span>{t("subtotal")}</span>
                <span>{subtotal}</span>
              </div>
              <div className="flex justify-between opacity-90">
                <span>{t("shipping")}</span>
                <span>{t("calcAtCheckout")}</span>
              </div>
              <div className="flex justify-between opacity-90">
                <span>{t("tax")}</span>
                <span>{t("calcAtCheckout")}</span>
              </div>
            </div>
            <div className="border-t border-white/40 pt-3 flex justify-between text-sm font-semibold">
              <span>{t("total")}</span>
              <span>{total}</span>
            </div>
            <a
              href={checkoutUrl ?? "#"}
              className="w-full block text-center rounded bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/80"
            >
              {t("checkout")}
            </a>
            <div className="w-full rounded border border-black px-4 py-3 text-sm font-semibold text-black hover:bg-black/10 text-center">
              <Link className="" href="/collections/all">
                {t("continueShopping")}
              </Link>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 mt-0.5 opacity-90" />
                <div>
                  <p className="font-semibold">{t("secureCheckout")}</p>
                  <p className="text-xs opacity-90">{t("secureCheckoutDesc")}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Globe2 className="h-5 w-5 mt-0.5 opacity-90" />
                <div>
                  <p className="font-semibold">{t("worldwideShipping")}</p>
                  <p className="text-xs opacity-90">{t("worldwideShippingDesc")}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 mt-0.5 opacity-90" />
                <div>
                  <p className="font-semibold">{t("easyReturns")}</p>
                  <p className="text-xs opacity-90">{t("easyReturnsDesc")}</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-center">{t("empty")}</div>
          <Link href="/collections/all">
            <Button className="mt-7">{t("continueShopping")}</Button>
          </Link>
        </div>
      )}
    </>
  );
}
