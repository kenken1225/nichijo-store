import type { CollectionFilterFacet } from "./collections";

/**
 * Storefront `FilterValue.input` is JSON; it may arrive as a plain object or as a JSON string
 * (RSC/serialization). GraphQL `ProductFilter` must be an object, not a string — otherwise
 * Shopify returns: Expected "..." to be a key-value object.
 */
export function normalizeProductFilterInput(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
    return null;
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return null;
}

export function normalizeProductFiltersList(filters: unknown[]): Record<string, unknown>[] {
  return filters
    .map((f) => normalizeProductFilterInput(f))
    .filter((x): x is Record<string, unknown> => x != null);
}

/** Base64url without Node's `Buffer` `base64url` encoding (unsupported in some browsers / polyfills). */
function utf8ToBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  if (typeof btoa === "undefined") {
    throw new Error("btoa is not available in this environment");
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(encoded: string): string {
  const pad = encoded.length % 4 === 0 ? "" : "=".repeat(4 - (encoded.length % 4));
  const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + pad;
  if (typeof atob === "undefined") {
    throw new Error("atob is not available in this environment");
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/** Deterministic JSON for comparing Shopify ProductFilter-shaped objects. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

/** Stable key for matching applied filters to facet values (handles string vs object input). */
export function filterInputKey(input: unknown): string {
  const n = normalizeProductFilterInput(input);
  return stableStringify(n ?? input);
}

export function encodeCollectionFiltersParam(filters: unknown[]): string {
  return utf8ToBase64Url(JSON.stringify(normalizeProductFiltersList(filters)));
}

export function decodeCollectionFiltersParam(encoded: string | undefined): unknown[] {
  if (!encoded?.trim()) return [];
  try {
    const parsed = JSON.parse(base64UrlToUtf8(encoded));
    if (!Array.isArray(parsed)) return [];
    return normalizeProductFiltersList(parsed);
  } catch {
    return [];
  }
}

/** Single-select per facet: clicking the active value clears; otherwise replaces that facet's selection. */
export function selectFacetFilterValue(
  facets: CollectionFilterFacet[],
  facetId: string,
  valueId: string,
  applied: unknown[]
): unknown[] {
  const facet = facets.find((f) => f.id === facetId);
  if (!facet) return applied;
  const value = facet.values.find((v) => v.id === valueId);
  if (!value) return applied;

  const keysForFacet = new Set(facet.values.map((v) => filterInputKey(v.input)));
  const withoutFacet = applied.filter((f) => !keysForFacet.has(filterInputKey(f)));
  const wasActive = applied.some((f) => filterInputKey(f) === filterInputKey(value.input));
  if (wasActive) return withoutFacet;
  const normalized = normalizeProductFilterInput(value.input);
  if (!normalized) return applied;
  return [...withoutFacet, normalized];
}

export function removeFilterByInputKey(applied: unknown[], inputKey: string): unknown[] {
  return applied.filter((f) => filterInputKey(f) !== inputKey);
}

export function chipsForAppliedFilters(
  facets: CollectionFilterFacet[],
  applied: unknown[]
): { inputKey: string; label: string }[] {
  return applied.map((f) => {
    const inputKey = filterInputKey(f);
    for (const facet of facets) {
      for (const v of facet.values) {
        if (filterInputKey(v.input) === inputKey) {
          return { inputKey, label: `${facet.label}: ${v.label}` };
        }
      }
    }
    return { inputKey, label: String(inputKey) };
  });
}
