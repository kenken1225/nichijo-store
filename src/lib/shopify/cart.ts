import { shopifyFetch } from "../shopify";
import type { CartLine, ShopifyCart } from "../types/shopify";
import { CART_QUERY } from "./queries";

type CartQuery = {
  cart:
    | (ShopifyCart & {
        lines: { edges: { node: CartLine }[] };
      })
    | null;
};

export type CartWithLines = ShopifyCart & { lines: CartLine[] };

export async function getCart(cartId: string): Promise<CartWithLines | null> {
  if (!cartId) return null;

  const data = await shopifyFetch<CartQuery>(CART_QUERY, { cartId });
  const cart = data?.cart;
  if (!cart) return null;

  const lines = cart.lines?.edges?.map(({ node }) => node) ?? [];

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    buyerIdentity: cart.buyerIdentity,
    attributes: cart.attributes ?? [],
    lines,
  };
}
