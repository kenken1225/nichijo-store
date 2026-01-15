import { shopifyFetch } from "../shopify";
import type { ShopifyPage } from "@/lib/types/shopify";
import { PAGES_LIST_QUERY, PAGE_BY_HANDLE_QUERY } from "./queries";

type PagesListQuery = {
  pages: { edges: { node: Pick<ShopifyPage, "handle" | "title"> }[] };
};

type PageByHandleQuery = {
  pages: {
    handle: ShopifyPage["handle"];
    title: ShopifyPage["title"];
    body?: ShopifyPage["contentHtml"];
    publishedAt: ShopifyPage["publishedAt"];
    updatedAt: ShopifyPage["updatedAt"];
  } | null;
};

export type PageHandle = Pick<ShopifyPage, "handle" | "title">;
export type PageDetail = {
  handle: ShopifyPage["handle"];
  title: ShopifyPage["title"];
  body?: ShopifyPage["contentHtml"];
  publishedAt?: ShopifyPage["publishedAt"];
  updatedAt?: ShopifyPage["updatedAt"];
};

export async function getPages(): Promise<PageHandle[]> {
  const data = await shopifyFetch<PagesListQuery>(PAGES_LIST_QUERY);
  return data?.pages?.edges?.map(({ node }) => node) ?? [];
}

export async function getPagesWithSummary(handle: string): Promise<PageDetail[]> {
  const data = await shopifyFetch<PageSummary>(PAGE_BY_HANDLE_QUERY, { handle });
  if (!data?.pages || !data.pages.edges) return [];

  const pages =
    data?.pages?.edges?.map(({ node }) => ({
      handle: node.handle,
      title: node.title,
      body: node.body ?? null,
      publishedAt: node.publishedAt ?? null,
      updatedAt: node.updatedAt ?? null,
    })) ?? [];

  return pages ?? [];
}
