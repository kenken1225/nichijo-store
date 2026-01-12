import clsx from "clsx";
import { formatPrice } from "@/lib/shopify";

type PriceProps = {
  amount: string;
  currencyCode: string;
  className?: string;
};

export function Price({ amount, currencyCode, className }: PriceProps) {
  return <span className={clsx("text-sm text-muted-foreground", className)}>{formatPrice(amount, currencyCode)}</span>;
}



