import { shopifyFetch, toShopifyLanguage, toShopifyCountry } from "../client";
import { normalizeProductFilterInput, normalizeProductFiltersList } from "./collection-filters";
import type { ShopifyImage } from "../../types/shopify";
import {
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY_FORWARD,
  COLLECTION_BY_HANDLE_QUERY_BACKWARD,
} from "../graphql/queries";
import type { ProductBadgeKind } from "./product-badges";
import { deriveProductBadges } from "./product-badges";

export type { ProductBadgeKind } from "./product-badges";

export const COLLECTION_PAGE_SIZE = 20;

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
  secondaryImage?: ShopifyImage | null;
  price?: { amount: string; currencyCode: string } | null;
  priceAmount?: number;
  priceCurrency?: string;
  available?: boolean;
  category?: string | null;
  createdAt?: string | null;
  badges: ProductBadgeKind[];
};

export type CollectionPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
};

export type CollectionFilterFacet = {
  id: string;
  label: string;
  type: string;
  presentation?: string | null;
  values: {
    id: string;
    label: string;
    count: number;
    input: Record<string, unknown>;
  }[];
};

export type CollectionWithProducts = CollectionNode & {
  products: CollectionProduct[];
  pageInfo: CollectionPageInfo;
  filterFacets: CollectionFilterFacet[];
};

type CollectionsQuery = {
  collections: {
    edges: { node: CollectionNode }[];
  };
};

type ProductNodeRaw = {
  handle: string;
  title: string;
  productType?: string | null;
  createdAt?: string | null;
  availableForSale: boolean;
  totalInventory?: number | null;
  tags?: string[];
  featuredImage?: ShopifyImage | null;
  images?: { edges: { node: ShopifyImage }[] };
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
};

type CollectionByHandleQueryResult = {
  collection:
    | (CollectionNode & {
        products: {
          filters?: CollectionFilterFacet[];
          pageInfo: CollectionPageInfo;
          edges: { node: ProductNodeRaw }[];
        };
      })
    | null;
};

function mapProductNode(node: ProductNodeRaw): CollectionProduct {
  const images = node.images?.edges?.map((e) => e.node) ?? [];
  const image = node.featuredImage ?? images[0] ?? null;
  const secondaryImage = images[1] ?? null;
  const minPrice = node.priceRange?.minVariantPrice ?? null;

  return {
    handle: node.handle,
    title: node.title,
    image,
    secondaryImage,
    price: minPrice,
    priceAmount: minPrice ? Number(minPrice.amount) : undefined,
    priceCurrency: minPrice?.currencyCode,
    available: node.availableForSale,
    category: node.productType ?? null,
    createdAt: node.createdAt ?? null,
    badges: deriveProductBadges({
      availableForSale: node.availableForSale,
      totalInventory: node.totalInventory,
      tags: node.tags,
    }),
  };
}

export type GetCollectionWithProductsOptions = {
  locale?: string;
  countryCode?: string;
  after?: string | null;
  before?: string | null;
  /** Storefront API ProductFilter inputs (from FilterValue.input), Search & Discovery–backed */
  productFilters?: unknown[];
};

export async function getCollections(locale?: string, countryCode?: string): Promise<CollectionSummary[]> {
  const data = await shopifyFetch<CollectionsQuery>(COLLECTIONS_QUERY, {
    language: toShopifyLanguage(locale),
    country: toShopifyCountry(countryCode),
  });
  return data?.collections?.edges?.map(({ node }) => node) ?? [];
}

function mapFilterFacets(raw: CollectionFilterFacet[] | undefined): CollectionFilterFacet[] {
  if (!raw?.length) return [];
  return raw.map((f) => ({
    id: f.id,
    label: f.label,
    type: f.type,
    presentation: f.presentation ?? null,
    values: (f.values ?? []).map((v) => ({
      id: v.id,
      label: v.label,
      count: v.count,
      input: normalizeProductFilterInput(v.input) ?? (v.input as Record<string, unknown>),
    })),
  }));
}

export async function getCollectionWithProducts(
  handle: string,
  options?: GetCollectionWithProductsOptions
): Promise<CollectionWithProducts | null> {
  const { locale, countryCode, after, before, productFilters } = options ?? {};

  const language = toShopifyLanguage(locale);
  const country = toShopifyCountry(countryCode);
  const filters = normalizeProductFiltersList(Array.isArray(productFilters) ? productFilters : []);

  const baseVars = { handle, language, country, filters };

  const data = before
    ? await shopifyFetch<CollectionByHandleQueryResult>(COLLECTION_BY_HANDLE_QUERY_BACKWARD, {
        ...baseVars,
        last: COLLECTION_PAGE_SIZE,
        before,
      })
    : await shopifyFetch<CollectionByHandleQueryResult>(COLLECTION_BY_HANDLE_QUERY_FORWARD, {
        ...baseVars,
        first: COLLECTION_PAGE_SIZE,
        ...(after ? { after } : {}),
      });

  if (!data?.collection) return null;

  const pi = data.collection.products?.pageInfo;
  const pageInfo: CollectionPageInfo = {
    hasNextPage: Boolean(pi?.hasNextPage),
    hasPreviousPage: Boolean(pi?.hasPreviousPage),
    endCursor: pi?.endCursor ?? null,
    startCursor: pi?.startCursor ?? null,
  };

  const products = data.collection.products?.edges?.map(({ node }) => mapProductNode(node)) ?? [];
  const filterFacets = mapFilterFacets(data.collection.products?.filters);

  return {
    handle: data.collection.handle,
    title: data.collection.title,
    description: data.collection.description,
    image: data.collection.image,
    products,
    pageInfo,
    filterFacets,
  };
}
