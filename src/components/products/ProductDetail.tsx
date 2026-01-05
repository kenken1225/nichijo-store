import type { ShopifyImage, ShopifyVariant } from "@/lib/types/shopify";
import { Container } from "@/components/layout/Container";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { RecentViewTracker } from "./RecentViewTracker";

type RecommendationItem = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  variantId?: string;
  available?: boolean;
};

type ProductDetailProps = {
  product: {
    title: string;
    descriptionHtml: string;
    handle: string;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
  };
  recommendations?: RecommendationItem[];
};

export function ProductDetail({ product, recommendations }: ProductDetailProps) {
  return (
    <section className="py-10 md:py-12">
      <Container className="grid gap-8 md:gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo
          title={product.title}
          descriptionHtml={product.descriptionHtml}
          variants={product.variants}
          recommendations={recommendations}
        />
        <RecentViewTracker handle={product.handle} />
      </Container>
    </section>
  );
}
