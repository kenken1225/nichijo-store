import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch, formatPrice, toShopifyCountry } from "@/lib/shopify";
import { PRODUCTS_BY_HANDLES_QUERY } from "@/lib/shopify/queries";
import { COUNTRY_COOKIE_KEY, getCountryByCode } from "@/lib/country-config";

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

  // get the country code from the cookies
  const cookieStore = await cookies();
  const countryCode = cookieStore.get(COUNTRY_COOKIE_KEY)?.value;
  const countryConfig = countryCode ? getCountryByCode(countryCode) : undefined;

  const query = handles.map((h) => `handle:${h}`).join(" OR ");

  try {
    const data = await shopifyFetch<{
      products: {
        edges: {
          node: {
            title: string;
            handle: string;
            featuredImage?: { url: string; altText?: string | null };
            images?: { edges: { node: { url: string; altText?: string | null } }[] };
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            variants: {
              edges: {
                node: { id: string; availableForSale: boolean; price: { amount: string; currencyCode: string } };
              }[];
            };
          };
        }[];
      };
    }>(PRODUCTS_BY_HANDLES_QUERY, { query, country: toShopifyCountry(countryCode) });

    const numberLocale = countryConfig?.numberLocale ?? "en-US";

    const items =
      data?.products?.edges.map(({ node }) => {
        const variantNode = node.variants?.edges?.[0]?.node;
        const price = node.priceRange?.minVariantPrice;
        const images = node.images?.edges?.map((e) => e.node) ?? [];
        const secondaryImage = images[1] ?? null;
        return {
          title: node.title,
          price: price ? formatPrice(price.amount, price.currencyCode, numberLocale) : "",
          href: `/products/${node.handle}`,
          imageUrl: node.featuredImage?.url,
          imageAlt: node.featuredImage?.altText ?? null,
          secondaryImageUrl: secondaryImage?.url ?? null,
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
