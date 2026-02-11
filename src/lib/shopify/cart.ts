import { shopifyFetch, toShopifyCountry } from "../shopify";
import type { CartLine, ShopifyCart } from "../types/shopify";
import { CART_QUERY } from "./queries";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
} from "./mutations";

type CartQuery = {
  cart:
    | (ShopifyCart & {
        lines: { edges: { node: CartLine }[] };
      })
    | null;
};

export type CartWithLines = ShopifyCart & { lines: CartLine[] };

type CartLineInput = { merchandiseId: string; quantity: number };
type CartLineUpdateInput = { id: string; quantity: number };

type CartMutationResponse<T extends string> = {
  [K in T]?: {
    cart: ShopifyCart & { lines: { edges: { node: CartLine }[] } };
    userErrors?: { field?: string; message: string }[];
  };
};

export function normalizeCart(cart: unknown): CartWithLines | null {
  if (!cart || typeof cart !== "object") return null;

  const rawCart = cart as ShopifyCart & {
    lines?: { edges?: { node: CartLine }[] } | CartLine[];
  };

  const linesRaw = rawCart.lines;
  const lines: CartLine[] = Array.isArray(linesRaw) ? linesRaw : linesRaw?.edges?.map(({ node }) => node) ?? [];

  return {
    id: rawCart.id,
    checkoutUrl: rawCart.checkoutUrl,
    totalQuantity: rawCart.totalQuantity,
    cost: rawCart.cost,
    buyerIdentity: rawCart.buyerIdentity,
    attributes: rawCart.attributes ?? [],
    lines,
  };
}

export async function getCart(cartId: string, countryCode?: string): Promise<CartWithLines | null> {
  if (!cartId) return null;

  const data = await shopifyFetch<CartQuery>(CART_QUERY, {
    cartId,
    country: toShopifyCountry(countryCode),
  });
  return normalizeCart(data?.cart);
}

export async function createCart(
  merchandiseId: string,
  quantity = 1,
  countryCode?: string
): Promise<{ cart: CartWithLines; cartId: string }> {
  const variables: Record<string, unknown> = {
    lines: [{ merchandiseId, quantity }] as CartLineInput[],
  };

  // 国コードがある場合、buyerIdentity に countryCode を設定して
  // Shopify Markets の通貨で価格を返してもらう
  if (countryCode) {
    variables.buyerIdentity = { countryCode: countryCode.toUpperCase() };
  }

  const data = await shopifyFetch<CartMutationResponse<"cartCreate">>(CART_CREATE_MUTATION, variables);

  const rawCart = data?.cartCreate?.cart;
  const err = data?.cartCreate?.userErrors?.[0]?.message;

  if (!rawCart || err) {
    throw new Error(err ?? "Failed to create cart");
  }

  const cart = normalizeCart(rawCart);
  if (!cart) {
    throw new Error("Failed to normalize cart");
  }

  return { cart, cartId: cart.id };
}

export async function addToCart(cartId: string, merchandiseId: string, quantity = 1, countryCode?: string): Promise<{ cart: CartWithLines }> {
  const data = await shopifyFetch<CartMutationResponse<"cartLinesAdd">>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId, quantity }] as CartLineInput[],
    country: toShopifyCountry(countryCode),
  });

  const rawCart = data?.cartLinesAdd?.cart;
  const err = data?.cartLinesAdd?.userErrors?.[0]?.message;

  if (!rawCart || err) {
    throw new Error(err ?? "Failed to add to cart");
  }

  const cart = normalizeCart(rawCart);
  if (!cart) {
    throw new Error("Failed to normalize cart");
  }

  return { cart };
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  countryCode?: string
): Promise<{ cart: CartWithLines }> {
  const data = await shopifyFetch<CartMutationResponse<"cartLinesUpdate">>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }] as CartLineUpdateInput[],
    country: toShopifyCountry(countryCode),
  });

  const rawCart = data?.cartLinesUpdate?.cart;
  const err = data?.cartLinesUpdate?.userErrors?.[0]?.message;

  if (!rawCart || err) {
    throw new Error(err ?? "Failed to update cart line");
  }

  const cart = normalizeCart(rawCart);
  if (!cart) {
    throw new Error("Failed to normalize cart");
  }

  return { cart };
}

export async function removeFromCart(cartId: string, lineIds: string[], countryCode?: string): Promise<{ cart: CartWithLines }> {
  const data = await shopifyFetch<CartMutationResponse<"cartLinesRemove">>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds,
    country: toShopifyCountry(countryCode),
  });

  const rawCart = data?.cartLinesRemove?.cart;
  const err = data?.cartLinesRemove?.userErrors?.[0]?.message;

  if (!rawCart || err) {
    throw new Error(err ?? "Failed to remove from cart");
  }

  const cart = normalizeCart(rawCart);
  if (!cart) {
    throw new Error("Failed to normalize cart");
  }

  return { cart };
}

/**
 * カートの buyerIdentity を更新して、国・通貨を切り替える
 * ユーザーが国を変更した時に既存カートの通貨も更新するために使う
 */
export async function updateCartCountry(cartId: string, countryCode: string): Promise<{ cart: CartWithLines }> {
  const data = await shopifyFetch<CartMutationResponse<"cartBuyerIdentityUpdate">>(
    CART_BUYER_IDENTITY_UPDATE_MUTATION,
    {
      cartId,
      buyerIdentity: { countryCode: countryCode.toUpperCase() },
    }
  );

  const rawCart = data?.cartBuyerIdentityUpdate?.cart;
  const err = data?.cartBuyerIdentityUpdate?.userErrors?.[0]?.message;

  if (!rawCart || err) {
    throw new Error(err ?? "Failed to update cart country");
  }

  const cart = normalizeCart(rawCart);
  if (!cart) {
    throw new Error("Failed to normalize cart");
  }

  return { cart };
}
