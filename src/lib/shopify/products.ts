import { shopifyFetch, formatPrice, toShopifyLanguage, toShopifyCountry } from "../shopify";
import { getCountryByCode } from "../country-config";
import type { ShopifyImage, ShopifyVariant } from "../types/shopify";
import {
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  PRODUCTS_BY_HANDLES_QUERY,
  PRODUCTS_LIST_QUERY,
} from "./queries";

type ProductQueryVariant = ShopifyVariant & {
  image?: ShopifyImage | null;
};

type ProductQuery = {
  product: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    featuredImage?: ShopifyImage | null;
    images: { edges: { node: ShopifyImage }[] };
    variants: { edges: { node: ProductQueryVariant }[] };
  } | null;
};

type RecommendationsQuery = {
  productRecommendations: {
    id: string;
    title: string;
    handle: string;
    featuredImage?: ShopifyImage | null;
    images?: { edges: { node: ShopifyImage }[] };
    variants?: { edges: { node: ShopifyVariant }[] };
    priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  }[];
};

export type ProductDetailData = {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  featuredImage?: ShopifyImage | null;
};

export type ProductRecommendation = {
  title: string;
  handle: string;
  priceFormatted: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  secondaryImageUrl?: string | null;
  variantId?: string;
  available?: boolean;
};

export async function getProductByHandle(handle: string, locale?: string, countryCode?: string): Promise<ProductDetailData | null> {
  const data = await shopifyFetch<ProductQuery>(PRODUCT_BY_HANDLE_QUERY, { handle, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  const product = data?.product;
  if (!product) return null;

  const imagesSet = new Map<string, ShopifyImage>();
  if (product.featuredImage) {
    imagesSet.set(product.featuredImage.url, product.featuredImage);
  }
  (product.images?.edges ?? []).forEach(({ node }) => {
    if (!imagesSet.has(node.url)) {
      imagesSet.set(node.url, node);
    }
  });
  const images = Array.from(imagesSet.values());
  const variants =
    product.variants?.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      availableForSale: node.availableForSale,
      quantityAvailable: node.quantityAvailable,
      selectedOptions: node.selectedOptions,
      price: node.price,
      image: node.image ?? null,
    })) ?? [];

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    handle: product.handle,
    images,
    variants,
    featuredImage: product.featuredImage,
  };
}

export async function getProductRecommendations(productId: string, locale?: string, countryCode?: string): Promise<ProductRecommendation[]> {
  const data = await shopifyFetch<RecommendationsQuery>(PRODUCT_RECOMMENDATIONS_QUERY, { productId, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  const numberLocale = countryCode ? getCountryByCode(countryCode).numberLocale : "en-US";
  return (
    data?.productRecommendations?.map((rec) => {
      const variantNode = rec.variants?.edges?.[0]?.node;
      const recPrice = rec.priceRange?.minVariantPrice ?? (variantNode?.price ? variantNode.price : undefined);
      const images = rec.images?.edges?.map((e) => e.node) ?? [];
      const secondaryImage = images[1] ?? null;
      return {
        title: rec.title,
        handle: rec.handle,
        priceFormatted: recPrice ? formatPrice(recPrice.amount, recPrice.currencyCode, numberLocale) : "",
        imageUrl: rec.featuredImage?.url,
        imageAlt: rec.featuredImage?.altText,
        secondaryImageUrl: secondaryImage?.url ?? null,
        variantId: variantNode?.id,
        available: variantNode?.availableForSale ?? true,
      };
    }) ?? []
  );
}

type ProductsListQuery = {
  products: {
    edges: {
      node: {
        handle: string;
        title: string;
        featuredImage?: ShopifyImage | null;
        images?: { edges: { node: ShopifyImage }[] };
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      };
    }[];
  };
};

export type ProductListItem = {
  handle: string;
  title: string;
  priceFormatted: string;
  image?: ShopifyImage | null;
};

export async function getProductsList(limit = 12, locale?: string, countryCode?: string): Promise<ProductListItem[]> {
  const data = await shopifyFetch<ProductsListQuery>(PRODUCTS_LIST_QUERY, { language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  const numberLocale = countryCode ? getCountryByCode(countryCode).numberLocale : "en-US";
  const edges = data?.products?.edges ?? [];
  return edges.slice(0, limit).map(({ node }) => {
    const image = node.featuredImage ?? node.images?.edges?.[0]?.node ?? null;
    const price = node.priceRange?.minVariantPrice;
    return {
      handle: node.handle,
      title: node.title,
      image,
      priceFormatted: price ? formatPrice(price.amount, price.currencyCode, numberLocale) : "",
    };
  });
}

// Seach Product Query

export async function searchProducts(query: string, locale?: string, countryCode?: string): Promise<ProductListItem[]> {
  const data = await shopifyFetch<ProductsListQuery>(PRODUCTS_BY_HANDLES_QUERY, { query, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  const numberLocale = countryCode ? getCountryByCode(countryCode).numberLocale : "en-US";
  const products = data?.products?.edges ?? [];

  return products.map(({ node }) => {
    const image = node.featuredImage ?? node.images?.edges?.[0]?.node ?? null;
    const price = node.priceRange?.minVariantPrice;

    return {
      handle: node.handle,
      title: node.title,
      image,
      priceFormatted: price ? formatPrice(price.amount, price.currencyCode, numberLocale) : "",
    };
  });
}
