import { formatPrice } from "@/lib/shopify/client";
import type { CartApiResponse, CartLine, MiniCartLine, ParsedCart } from "@/lib/types/shopify";

function getCartLinesArray(lines: CartApiResponse["lines"] | undefined): CartLine[] {
  if (!lines) return [];
  if (Array.isArray(lines)) return lines;
  if ("edges" in lines && Array.isArray(lines.edges)) {
    return lines.edges.map((e) => e.node);
  }
  return [];
}

export function parseCartApiResponse(cart: CartApiResponse | null, numberLocale: string): ParsedCart {
  const rawLines = getCartLinesArray(cart?.lines);
  const lines: MiniCartLine[] = rawLines.map((item) => {
    const merch = item.merchandise;
    const image = merch.product?.featuredImage ?? merch.image;
    const price = merch.price
      ? formatPrice(merch.price.amount, merch.price.currencyCode, numberLocale)
      : "";
    return {
      id: item.id ?? "",
      quantity: item.quantity ?? 1,
      title: merch.product?.title ?? merch.title ?? "",
      variantTitle: merch.title ?? "",
      price,
      imageUrl: image?.url,
      imageAlt: image?.altText,
    };
  });
  const subtotalNode = cart?.cost?.subtotalAmount;
  const subtotal = subtotalNode
    ? formatPrice(subtotalNode.amount, subtotalNode.currencyCode, numberLocale)
    : "";
  return {
    lines,
    subtotal,
    checkoutUrl: cart?.checkoutUrl ?? null,
    totalQuantity: cart?.totalQuantity ?? 0,
  };
}
