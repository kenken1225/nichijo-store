import { shopifyFetch } from "../shopify";
import type { ShopifyImage } from "../types/shopify";
import { COLLECTIONS_QUERY, COLLECTION_BY_HANDLE_QUERY } from "./queries";

type CollectionNode = {
  handle: string;
  title: string;
  description?: string | null;
  image?: ShopifyImage | null;
};

export type CollectionSummary = CollectionNode;

export type CollectionProduct = {
  handle: string;
  title: string;
  image?: ShopifyImage | null;
  price?: { amount: string; currencyCode: string } | null;
  priceAmount?: number;
  priceCurrency?: string;
  variantId?: string;
  available?: boolean;
  quantityAvailable?: number | null;
  category?: string | null;
  createdAt?: string | null;
};

export type CollectionWithProducts = CollectionNode & {
  products: CollectionProduct[];
};

type CollectionsQuery = {
  collections: {
    edges: { node: CollectionNode }[];
  };
};

type CollectionByHandleQuery = {
  collection:
    | (CollectionNode & {
        products: {
          edges: {
            node: {
              handle: string;
              title: string;
              productType?: string | null;
              createdAt?: string | null;
              featuredImage?: ShopifyImage | null;
              images?: { edges: { node: ShopifyImage }[] };
              priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
              variants?: {
                edges: {
                  node: {
                    id: string;
                    availableForSale?: boolean;
                    quantityAvailable?: number | null;
                    price: { amount: string; currencyCode: string };
                  };
                }[];
              };
            };
          }[];
        };
      })
    | null;
};

export async function getCollections(): Promise<CollectionSummary[]> {
  const data = await shopifyFetch<CollectionsQuery>(COLLECTIONS_QUERY);
  return data?.collections?.edges?.map(({ node }) => node) ?? [];
}

export async function getCollectionWithProducts(handle: string): Promise<CollectionWithProducts | null> {
  const data = await shopifyFetch<CollectionByHandleQuery>(COLLECTION_BY_HANDLE_QUERY, { handle });
  if (!data?.collection) return null;

  const products =
    data.collection.products?.edges?.map(({ node }) => {
      const image = node.featuredImage ?? node.images?.edges?.[0]?.node ?? null;
      const minPrice = node.priceRange?.minVariantPrice ?? null;
      const variants = node.variants?.edges?.map((e) => e.node) ?? [];
      const availableVariant = variants.find((v) => v.availableForSale !== false);
      const firstVariant = availableVariant ?? variants[0];
      const isAvailable = variants.some((v) => v.availableForSale !== false);
      return {
        handle: node.handle,
        title: node.title,
        image,
        price: minPrice,
        priceAmount: minPrice ? Number(minPrice.amount) : undefined,
        priceCurrency: minPrice?.currencyCode,
        variantId: firstVariant?.id,
        available: isAvailable,
        quantityAvailable: firstVariant?.quantityAvailable ?? null,
        category: node.productType ?? null,
        createdAt: node.createdAt ?? null,
      };
    }) ?? [];

  return {
    handle: data.collection.handle,
    title: data.collection.title,
    description: data.collection.description,
    image: data.collection.image,
    products,
  };
}
