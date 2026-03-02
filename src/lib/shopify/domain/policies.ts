import { shopifyFetch, toShopifyLanguage, toShopifyCountry } from "../client";
import type { ShopifyPolicies } from "../../types/shopify";
import { POLICIES_QUERY } from "../graphql/queries";

type PoliciesQuery = {
  shop: {
    privacyPolicy: ShopifyPolicies | null;
    termsOfService: ShopifyPolicies | null;
    shippingPolicy: ShopifyPolicies | null;
    refundPolicy: ShopifyPolicies | null;
  } | null;
};

type PoliciesMap = {
  privacyPolicy: ShopifyPolicies | null;
  termsOfService: ShopifyPolicies | null;
  shippingPolicy: ShopifyPolicies | null;
  refundPolicy: ShopifyPolicies | null;
};

const POLICY_KEYS: (keyof PoliciesMap)[] = ["privacyPolicy", "termsOfService", "shippingPolicy", "refundPolicy"];

export async function getPolicies(locale?: string, countryCode?: string): Promise<PoliciesMap> {
  const data = await shopifyFetch<PoliciesQuery>(POLICIES_QUERY, { language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });

  return {
    privacyPolicy: data?.shop?.privacyPolicy ?? null,
    termsOfService: data?.shop?.termsOfService ?? null,
    shippingPolicy: data?.shop?.shippingPolicy ?? null,
    refundPolicy: data?.shop?.refundPolicy ?? null,
  };
}

export async function getPolicyList(locale?: string): Promise<ShopifyPolicies[]> {
  const policies = await getPolicies(locale);

  return POLICY_KEYS.flatMap((key) => {
    const policy = policies[key];
    return policy ? [policy] : [];
  });
}

export async function getPolicyByHandle(handle: string, locale?: string): Promise<ShopifyPolicies | null> {
  if (!handle) return null;

  const policies = await getPolicyList(locale);
  const lowerHandle = handle.toLowerCase();

  return policies.find((policy) => policy.handle?.toLowerCase() === lowerHandle) ?? null;
}
