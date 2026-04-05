"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type CountryConfig, getCountryByCode, DEFAULT_COUNTRY, setCountryCodeCookieClient } from "@/lib/country-config";

type CountryContextType = {
  country: CountryConfig;
  setCountry: (code: string) => void;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

type CountryProviderProps = {
  children: ReactNode;
  initialCountryCode?: string;
};

function resolveInitialCountry(code: string | undefined): CountryConfig {
  return code ? getCountryByCode(code) : DEFAULT_COUNTRY;
}

export function CountryProvider({ children, initialCountryCode }: CountryProviderProps) {
  const [country, setCountryState] = useState<CountryConfig>(() => resolveInitialCountry(initialCountryCode));

  const setCountry = useCallback((code: string) => {
    const next = getCountryByCode(code);
    setCountryState(next);
    setCountryCodeCookieClient(next.code);
    // Full reload: server components + layout re-read the cookie and refetch Shopify with the new market.
    window.location.reload();
  }, []);

  return <CountryContext.Provider value={{ country, setCountry }}>{children}</CountryContext.Provider>;
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
