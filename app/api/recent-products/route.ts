import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCTS_BY_HANDLES_QUERY } from "@/lib/shopify/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handlesParam = searchParams.get("handles");
  if (!handlesParam) {
    return NextResponse.json({ items: [] });
  }
  const handles = handlesParam
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  if (!handles.length) {
    return NextResponse.json({ items: [] });
  }

  const query = handles.map((h) => `handle:${h}`).join(" OR ");

  try {
    const data = await shopifyFetch<{
      products: {
        edges: {
          node: {
            title: string;
            handle: string;
            featuredImage?: { url: string; altText?: string | null };
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            variants: {
              edges: {
                node: { id: string; availableForSale: boolean; price: { amount: string; currencyCode: string } };
              }[];
            };
          };
        }[];
      };
    }>(PRODUCTS_BY_HANDLES_QUERY, { query });

    const items =
      data?.products?.edges.map(({ node }) => {
        const variantNode = node.variants?.edges?.[0]?.node;
        const price = node.priceRange?.minVariantPrice;
        return {
          title: node.title,
          price: price ? `${price.amount} ${price.currencyCode}` : "",
          href: `/products/${node.handle}`,
          imageUrl: node.featuredImage?.url,
          imageAlt: node.featuredImage?.altText ?? null,
          variantId: variantNode?.id,
          available: variantNode?.availableForSale ?? true,
        };
      }) ?? [];

    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, items: [] }, { status: 500 });
  }
}
