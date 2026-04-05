/** Country / currency / language mapping for Shopify Markets */

export type CountryConfig = {
  code: string;
  nameEn: string;
  nameAr: string;
  currency: string;
  currencyNameEn: string;
  flag: string;
  numberLocale: string;
};

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: "JP",
    nameEn: "Japan",
    nameAr: "اليابان",
    currency: "JPY",
    currencyNameEn: "Japanese Yen",
    flag: "🇯🇵",
    numberLocale: "en-JP",
  },
  {
    code: "US",
    nameEn: "United States",
    nameAr: "الولايات المتحدة",
    currency: "USD",
    currencyNameEn: "US Dollar",
    flag: "🇺🇸",
    numberLocale: "en-US",
  },
  {
    code: "AE",
    nameEn: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
    currency: "AED",
    currencyNameEn: "UAE Dirham",
    flag: "🇦🇪",
    numberLocale: "en-AE",
  },
  {
    code: "SA",
    nameEn: "Saudi Arabia",
    nameAr: "المملكة العربية السعودية",
    currency: "SAR",
    currencyNameEn: "Saudi Riyal",
    flag: "🇸🇦",
    numberLocale: "en-SA",
  },
  {
    code: "GB",
    nameEn: "United Kingdom",
    nameAr: "المملكة المتحدة",
    currency: "GBP",
    currencyNameEn: "British Pound",
    flag: "🇬🇧",
    numberLocale: "en-GB",
  },
  {
    code: "DE",
    nameEn: "Germany",
    nameAr: "ألمانيا",
    currency: "EUR",
    currencyNameEn: "Euro",
    flag: "🇩🇪",
    numberLocale: "de-DE",
  },
  {
    code: "AU",
    nameEn: "Australia",
    nameAr: "أستراليا",
    currency: "AUD",
    currencyNameEn: "Australian Dollar",
    flag: "🇦🇺",
    numberLocale: "en-AU",
  },
  {
    code: "CA",
    nameEn: "Canada",
    nameAr: "كندا",
    currency: "CAD",
    currencyNameEn: "Canadian Dollar",
    flag: "🇨🇦",
    numberLocale: "en-CA",
  },
];

export const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES.find((c) => c.code === "US")!;

/** Returns CountryConfig by code, falls back to DEFAULT_COUNTRY */
export function getCountryByCode(code: string): CountryConfig {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code.toUpperCase()) ?? DEFAULT_COUNTRY;
}

export const COUNTRY_COOKIE_KEY = "country_code";
export const GEO_CONFIRMED_COOKIE_KEY = "geo_confirmed";

/** Cookie lifetime for saved shipping/pricing country (Shopify Markets context). */
export const COUNTRY_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Persists country on the client so the next full navigation / RSC request sends
 * {@link COUNTRY_COOKIE_KEY}. Safe to call only in the browser.
 */
export function setCountryCodeCookieClient(countryCode: string): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(countryCode);
  document.cookie = `${COUNTRY_COOKIE_KEY}=${value};path=/;max-age=${COUNTRY_COOKIE_MAX_AGE_SECONDS};samesite=lax`;
}

// helper to get the country code from the cookies for server components
export async function getCountryCode(): Promise<string> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(COUNTRY_COOKIE_KEY)?.value ?? DEFAULT_COUNTRY.code;
}
