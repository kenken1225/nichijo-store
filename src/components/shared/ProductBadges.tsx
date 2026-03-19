import type { ProductBadgeKind } from "@/lib/shopify/domain/product-badges";
export type ProductBadgeItem = {
  kind: ProductBadgeKind;
  label: string;
};

function badgeClassName(kind: ProductBadgeKind): string {
  switch (kind) {
    case "soldOut":
      return "bg-red-600 text-white";
    case "limitedStock":
      return "bg-blue-600 text-white";
    case "popular":
      return "bg-[#c77d58] text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

type ProductBadgesProps = {
  badges: ProductBadgeItem[];
  variant?: "overlay" | "inline";
  className?: string;
};

export function ProductBadges({ badges, variant = "overlay", className = "" }: ProductBadgesProps) {
  if (!badges.length) return null;

  const position =
    variant === "overlay"
      ? "absolute left-2 top-2 z-10 flex max-w-[calc(100%-1rem)] flex-col gap-1"
      : "flex max-w-full flex-row flex-wrap gap-2";

  return (
    <div className={`${position} ${className}`.trim()}>
      {badges.map((b) => (
        <span
          key={`${b.kind}-${b.label}`}
          className={`inline-block max-w-full truncate rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${badgeClassName(b.kind)}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
