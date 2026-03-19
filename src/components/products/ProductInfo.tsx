import type { ShopifyVariant } from "@/lib/types/shopify";
import type { ParsedCart } from "@/lib/types/shopify";
import type { ProductBadgeItem } from "@/components/shared/ProductBadges";
import type { ProductBadgeKind } from "@/lib/shopify/domain/product-badges";
import { ProductActions } from "./ProductActions";

type RecommendationItem = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  variantId?: string;
  available?: boolean;
  badgeKinds?: ProductBadgeKind[];
};

type ProductInfoProps = {
  title: string;
  descriptionHtml: string;
  variants: ShopifyVariant[];
  headerBadges: ProductBadgeItem[];
  recommendations?: RecommendationItem[];
  onVariantImageChange?: (imageUrl: string | null) => void;
  onAddedToCart?: (parsed: ParsedCart) => void;
};

export function ProductInfo(props: ProductInfoProps) {
  return <ProductActions {...props} />;
}
