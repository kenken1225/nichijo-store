import type { ShopifyImage, ShopifyVariant } from "@/lib/types/shopify";
import type { ParsedCart } from "@/lib/types/shopify";
import type { ProductBadgeItem } from "@/components/shared/ProductBadges";
import { Container } from "@/components/layout/Container";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { RecentViewTracker } from "./RecentViewTracker";

type ProductDetailProps = {
  product: {
    title: string;
    descriptionHtml: string;
    handle: string;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
  };
  headerBadges: ProductBadgeItem[];
  onAddedToCart?: (parsed: ParsedCart) => void;
  selectedVariantImageUrl?: string | null;
  onVariantImageChange?: (imageUrl: string | null) => void;
};

export function ProductDetail({
  product,
  headerBadges,
  onAddedToCart,
  selectedVariantImageUrl,
  onVariantImageChange,
}: ProductDetailProps) {
  return (
    <section className="py-10 md:py-12">
      <Container className="grid gap-8 md:gap-10 md:grid-cols-2">
        <ProductGallery
          images={product.images}
          title={product.title}
          selectedVariantImageUrl={selectedVariantImageUrl}
        />
        <ProductInfo
          title={product.title}
          descriptionHtml={product.descriptionHtml}
          variants={product.variants}
          headerBadges={headerBadges}
          onAddedToCart={onAddedToCart}
          onVariantImageChange={onVariantImageChange}
        />
      </Container>
      <RecentViewTracker handle={product.handle} />
    </section>
  );
}
