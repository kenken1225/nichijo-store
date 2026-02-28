type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const LOCALE_TO_LANGUAGE: Record<string, string> = {
  en: "EN",
  ar: "AR",
};

export function toShopifyLanguage(locale?: string): string | undefined {
  if (!locale) return undefined;
  return LOCALE_TO_LANGUAGE[locale];
}

export function toShopifyCountry(countryCode?: string): string | undefined {
  if (!countryCode) return undefined;
  return countryCode.toUpperCase();
}

// RequestInit means that it can take all the options that a fetch request can take
type ShopifyFetchOptions = RequestInit & {
  /** next.js fetch options like revalidate */
  next?: RequestInit["next"];
};

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {}
) {
  if (!SHOP_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error("Shopify credentials are not set");
  }

  const res = await fetch(`https://${SHOP_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      ...(options.headers ?? {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: options.cache ?? "no-store",
    next: options.next,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify fetch failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }
  return json.data as T;
}

// format the price
export function formatPrice(amount: string, currencyCode: string, locale = "en-US") {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

export function formatDate(dateString: string, locale = "en-US") {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
