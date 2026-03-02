import { notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ProductPageWithDrawer } from "@/components/products/ProductPageWithDrawer";
import { WhyLoveIt } from "@/components/products/WhyLoveIt";
import { CustomerReviews } from "@/components/products/CustomerReviews";
import { getCountryCode } from "@/lib/country-config";
import { getProductByHandle, getProductRecommendations } from "@/lib/shopify/domain/products";

const YouMayAlsoLike = dynamic(() => import("@/components/products/YouMayAlsoLike").then((mod) => mod.YouMayAlsoLike), {
  loading: () => <div className="h-64 w-full animate-pulse bg-muted" />,
});

const getSiteUrl = () => process.env.SITE_URL ?? "https://nichijo-jp.com";

export async function ProductContent({ handle }: { handle: string }) {
  const t = await getTranslations("product");
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const product = await getProductByHandle(handle, locale, countryCode);
  if (!product) {
    notFound();
  }

  const recommendationsData = product.id ? await getProductRecommendations(product.id, locale, countryCode) : [];
  const recommendations = recommendationsData.map((rec) => ({
    title: rec.title,
    price: rec.priceFormatted,
    href: `/products/${rec.handle}`,
    imageUrl: rec.imageUrl,
    imageAlt: rec.imageAlt,
    secondaryImageUrl: rec.secondaryImageUrl,
    variantId: rec.variantId,
    available: rec.available,
  }));

  // JSON-LD for Google Rich Snippets
  const siteUrl = getSiteUrl();
  const firstVariantPrice = product.variants[0]?.price;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    url: `${siteUrl}/products/${product.handle}`,
    ...(firstVariantPrice
      ? {
          offers: {
            "@type": "Offer",
            price: firstVariantPrice.amount,
            priceCurrency: firstVariantPrice.currencyCode,
            availability: product.variants.some((v) => v.availableForSale)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${siteUrl}/products/${product.handle}`,
          },
        }
      : {}),
  };

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-10 md:pt-12">
        <Container className="space-y-3">
          <Link href={`/collections/all`} className="text-sm text-muted-foreground hover:text-foreground">
            {t("backToAll")}
          </Link>
        </Container>
      </section>

      <ProductPageWithDrawer
        product={{
          title: product.title,
          descriptionHtml: product.descriptionHtml,
          handle: product.handle,
          images: product.images,
          variants: product.variants,
        }}
        recommendations={recommendations}
      />

      <WhyLoveIt />
      <Suspense fallback={null}>
        <CustomerReviews />
      </Suspense>
      <YouMayAlsoLike
        items={recommendations.length ? recommendations : undefined}
        useRecentLocalStorage
        showAddButton
        variant="default"
        title={t("youMayAlsoLike")}
      />
    </div>
  );
}
