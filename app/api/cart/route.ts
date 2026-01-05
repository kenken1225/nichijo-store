import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
    }
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              product { title handle }
              image { url altText }
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

type CartLineInput = { merchandiseId: string; quantity: number };

export async function POST(req: Request) {
  const {
    cartId,
    merchandiseId,
    quantity = 1,
  } = (await req.json()) as {
    cartId?: string;
    merchandiseId?: string;
    quantity?: number;
  };

  if (!merchandiseId) {
    return NextResponse.json({ error: "merchandiseId is required" }, { status: 400 });
  }

  try {
    if (!cartId) {
      const create = await shopifyFetch<{
        cartCreate?: { cart: unknown; userErrors?: { message: string }[] };
      }>(CART_CREATE_MUTATION, { lines: [{ merchandiseId, quantity }] as CartLineInput[] });

      const cart = create?.cartCreate?.cart;
      const err = create?.cartCreate?.userErrors?.[0]?.message;
      if (!cart || err) {
        throw new Error(err ?? "Failed to create cart");
      }
      return NextResponse.json({ cartId: (cart as { id: string }).id, cart });
    }

    const add = await shopifyFetch<{
      cartLinesAdd?: { cart: unknown; userErrors?: { message: string }[] };
    }>(CART_LINES_ADD_MUTATION, { cartId, lines: [{ merchandiseId, quantity }] as CartLineInput[] });

    const cart = add?.cartLinesAdd?.cart;
    const err = add?.cartLinesAdd?.userErrors?.[0]?.message;
    if (!cart || err) {
      throw new Error(err ?? "Failed to add to cart");
    }

    return NextResponse.json({ cartId, cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { cartId, lineIds } = (await req.json()) as { cartId?: string; lineIds?: string[] };
  if (!cartId || !lineIds?.length) {
    return NextResponse.json({ error: "cartId and lineIds are required" }, { status: 400 });
  }
  try {
    const remove = await shopifyFetch<{
      cartLinesRemove?: { cart: unknown; userErrors?: { message: string }[] };
    }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });

    const cart = remove?.cartLinesRemove?.cart;
    const err = remove?.cartLinesRemove?.userErrors?.[0]?.message;
    if (!cart || err) {
      throw new Error(err ?? "Failed to remove from cart");
    }

    return NextResponse.json({ cartId, cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
