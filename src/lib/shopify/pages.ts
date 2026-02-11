import { shopifyFetch, toShopifyLanguage, toShopifyCountry } from "../shopify";
import type { ShopifyPagesList, ShopifyPage } from "@/lib/types/shopify";
import { PAGES_LIST_QUERY, PAGE_BY_HANDLE_QUERY } from "./queries";

type PagesListQuery = {
  pages: { edges: { node: ShopifyPagesList }[] } | null;
};

type PageSingleQuery = {
  page: ShopifyPage | null;
};

export type PageListHandle = PagesListQuery;
export type PageSingleHandle = PageSingleQuery;

export async function getPageList(locale?: string, countryCode?: string): Promise<ShopifyPagesList[]> {
  const data = await shopifyFetch<PagesListQuery>(PAGES_LIST_QUERY, { language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  return data?.pages?.edges?.map(({ node }) => node) ?? [];
}

export async function getPageSingle(handle: string, locale?: string, countryCode?: string): Promise<ShopifyPage | null> {
  const data = await shopifyFetch<PageSingleQuery>(PAGE_BY_HANDLE_QUERY, { handle, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  if (!data?.page) return null;

  const page = {
    handle: data.page.handle ?? undefined,
    title: data.page.title,
    body: data.page.body ?? null,
    updatedAt: data.page.updatedAt ?? null,
  };

  return page ?? null;
}
