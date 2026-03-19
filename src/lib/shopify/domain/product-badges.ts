export type ProductBadgeKind = "soldOut" | "limitedStock" | "popular";

type DeriveProductBadgesInput = {
  availableForSale?: boolean;
  tags?: string[] | null;
  totalInventory?: number | null;
  quantityAvailable?: number | null;
};
export function deriveProductBadges(input: DeriveProductBadgesInput): ProductBadgeKind[] {
  const badges: ProductBadgeKind[] = [];
  const isAvailable = input.availableForSale !== false;
  const hasPopular = input.tags?.some((tag) => tag.toLowerCase() === "popular") ?? false;

  if (!isAvailable) {
    badges.push("soldOut");
  } else {
    const inventory =
      typeof input.totalInventory === "number"
        ? input.totalInventory
        : typeof input.quantityAvailable === "number"
          ? input.quantityAvailable
          : null;

    if (typeof inventory === "number" && inventory >= 1 && inventory <= 3) {
      badges.push("limitedStock");
    }
  }

  if (hasPopular) {
    badges.push("popular");
  }

  return badges;
}
