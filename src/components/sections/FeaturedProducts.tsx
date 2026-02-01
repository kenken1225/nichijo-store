import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import { ArrowRight } from "lucide-react";
import { getProductsList } from "@/lib/shopify/products";

export async function FeaturedProducts() {
  const products = await getProductsList(8);

  return (
    <section className="py-16 sm:py-20 bg-stone-100">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Featured Collection
          </h2>
          <p className="text-muted-foreground">
            Curated pieces celebrating Japanese creativity
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.handle}
              title={product.title}
              price={product.priceFormatted}
              href={`/products/${product.handle}`}
              imageUrl={product.image?.url ?? null}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:underline"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
