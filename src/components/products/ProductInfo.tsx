import type { ShopifyVariant } from "@/lib/types/shopify";
import { ProductActions } from "./ProductActions";

type RecommendationItem = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  variantId?: string;
  available?: boolean;
};

type ProductInfoProps = {
  title: string;
  descriptionHtml: string;
  variants: ShopifyVariant[];
  recommendations?: RecommendationItem[];
  onVariantImageChange?: (imageUrl: string | null) => void;
};

export function ProductInfo(props: ProductInfoProps) {
  return <ProductActions {...props} />;
}
