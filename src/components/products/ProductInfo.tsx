import type { ShopifyVariant } from "@/lib/types/shopify";
import type { ParsedCart } from "@/lib/types/shopify";
import type { ProductBadgeItem } from "@/components/shared/ProductBadges";
import { ProductActions } from "./ProductActions";

type ProductInfoProps = {
  title: string;
  descriptionHtml: string;
  variants: ShopifyVariant[];
  headerBadges: ProductBadgeItem[];
  onVariantImageChange?: (imageUrl: string | null) => void;
  onAddedToCart?: (parsed: ParsedCart) => void;
};

export function ProductInfo(props: ProductInfoProps) {
  return <ProductActions {...props} />;
}
