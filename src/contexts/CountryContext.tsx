"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type CountryConfig, getCountryByCode, DEFAULT_COUNTRY, COUNTRY_COOKIE_KEY } from "@/lib/country-config";

type CountryContextType = {
  country: CountryConfig;
  setCountry: (code: string) => void;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

type CountryProviderProps = {
  children: ReactNode;
  initialCountryCode?: string;
};

export function CountryProvider({ children, initialCountryCode }: CountryProviderProps) {
  const [country, setCountryState] = useState<CountryConfig>(
    initialCountryCode ? getCountryByCode(initialCountryCode) : DEFAULT_COUNTRY
  );

  const setCountry = useCallback((code: string) => {
    const newCountry = getCountryByCode(code);
    setCountryState(newCountry);

    // save the country code to the cookie (valid for 1 year)
    document.cookie = `${COUNTRY_COOKIE_KEY}=${newCountry.code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

    // reload the page to get the prices in the new country's currency
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
