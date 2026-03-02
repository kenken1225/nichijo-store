import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import { ArrowRight } from "lucide-react";
import { getProductsList } from "@/lib/shopify/domain/products";
import { getTranslations, getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

export async function FeaturedProducts() {
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const products = await getProductsList(8, locale, countryCode);
  const t = await getTranslations("featured");

  return (
    <section className="py-16 sm:py-20 bg-stone-100">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">
            {t("subtitle")}
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
            {t("viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
