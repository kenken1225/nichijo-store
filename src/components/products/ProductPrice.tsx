type ProductPriceProps = {
  value: string;
};

export function ProductPrice({ value }: ProductPriceProps) {
  if (!value) return null;
  return <p className="text-xl font-medium text-foreground">{value}</p>;
}
