import { shopifyFetch, toShopifyLanguage, toShopifyCountry } from "../client";
import { MENU_QUERY } from "../graphql/queries";

export type MenuItem = {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
};

export type Menu = {
  id: string;
  handle: string;
  title: string;
  items: MenuItem[];
};

type MenuQueryResponse = {
  menu: Menu | null;
};

export async function getMenu(handle: string, locale?: string, countryCode?: string): Promise<Menu | null> {
  const data = await shopifyFetch<MenuQueryResponse>(MENU_QUERY, { handle, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  return data?.menu ?? null;
}

export function normalizeMenuUrl(url: string): string {
  if (!url) return "/";

  try {
    const urlObj = new URL(url);
    return urlObj.pathname || "/";
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

export function isExternalUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return (
      !urlObj.hostname.includes("myshopify.com") &&
      !urlObj.hostname.includes("localhost") &&
      urlObj.protocol.startsWith("http")
    );
  } catch {
    return false;
  }
}
