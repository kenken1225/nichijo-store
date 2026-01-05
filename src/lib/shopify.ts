type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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
    throw new Error("SHOPIFY_STORE_DOMAIN と SHOPIFY_STOREFRONT_ACCESS_TOKEN を設定してください。");
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

export function formatPrice(amount: string, currencyCode: string) {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value);
}
