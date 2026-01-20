import { shopifyFetch } from "../shopify";
import type { ShopifyPolicies } from "@/lib/types/shopify";
import { POLICIES_QUERY } from "./queries";

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

export async function getPolicies(): Promise<PoliciesMap> {
  const data = await shopifyFetch<PoliciesQuery>(POLICIES_QUERY);

  return {
    privacyPolicy: data?.shop?.privacyPolicy ?? null,
    termsOfService: data?.shop?.termsOfService ?? null,
    shippingPolicy: data?.shop?.shippingPolicy ?? null,
    refundPolicy: data?.shop?.refundPolicy ?? null,
  };
}

export async function getPolicyList(): Promise<ShopifyPolicies[]> {
  const policies = await getPolicies();

  return POLICY_KEYS.flatMap((key) => {
    const policy = policies[key];
    return policy ? [policy] : [];
  });
}

export async function getPolicyByHandle(handle: string): Promise<ShopifyPolicies | null> {
  if (!handle) return null;

  const policies = await getPolicyList();
  const lowerHandle = handle.toLowerCase();

  return policies.find((policy) => policy.handle?.toLowerCase() === lowerHandle) ?? null;
}
