"use client";

import clsx from "clsx";
import { formatPrice } from "@/lib/shopify/client";
import { useCountry } from "@/contexts/CountryContext";

type PriceProps = {
  amount: string;
  currencyCode: string;
  className?: string;
};

export function Price({ amount, currencyCode, className }: PriceProps) {
  const { country } = useCountry();
  return (
    <span className={clsx("text-sm text-muted-foreground", className)}>
      {formatPrice(amount, currencyCode, country.numberLocale)}
    </span>
  );
}
