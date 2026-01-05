import type { CollectionProduct } from "@/lib/shopify/collections";
import { formatPrice } from "@/lib/shopify";
import { ProductCard } from "@/components/shared/ProductCard";

type CollectionProductGridProps = {
  products: CollectionProduct[];
};

export function CollectionProductGrid({ products }: CollectionProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.handle}
          title={product.title}
          price={
            product.price?.amount && product.price?.currencyCode
              ? formatPrice(product.price.amount, product.price.currencyCode)
              : ""
          }
          href={`/products/${product.handle}`}
          imageUrl={product.image?.url}
          imageAlt={product.image?.altText}
        />
      ))}
    </div>
  );
}
