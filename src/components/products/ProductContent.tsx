import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ProductPageWithDrawer } from "@/components/products/ProductPageWithDrawer";
import { WhyLoveIt } from "@/components/products/WhyLoveIt";
import { CustomerReviews } from "@/components/products/CustomerReviews";
import { YouMayAlsoLikeFromPromise } from "@/components/products/ProductRecommendationsFromPromise";
import { getCountryCode } from "@/lib/country-config";
import {
  getProductByHandle,
  getProductRecommendations,
  mapProductRecommendationsToUiItems,
  type ProductRecommendationUiItem,
} from "@/lib/shopify/domain/products";
import { deriveProductBadges } from "@/lib/shopify/domain/product-badges";
import type { ProductBadgeKind } from "@/lib/shopify/domain/product-badges";
import type { ProductBadgeItem } from "@/components/shared/ProductBadges";

const getSiteUrl = () => process.env.SITE_URL ?? "https://nichijo-jp.com";

function badgeItemsFromKinds(kinds: ProductBadgeKind[], tBadges: (key: string) => string): ProductBadgeItem[] {
  return kinds.map((kind) => ({
    kind,
    label:
      kind === "soldOut"
        ? tBadges("badgeSoldOut")
        : kind === "limitedStock"
          ? tBadges("badgeLimitedStock")
          : tBadges("badgePopular"),
  }));
}

export async function ProductContent({ handle }: { handle: string }) {
  const localePromise = getLocale();
  const countryCodePromise = getCountryCode();
  const productPromise = Promise.all([localePromise, countryCodePromise]).then(([locale, countryCode]) =>
    getProductByHandle(handle, locale, countryCode)
  );

  const [t, tBadges, locale, countryCode, product] = await Promise.all([
    getTranslations("product"),
    getTranslations("collections"),
    localePromise,
    countryCodePromise,
    productPromise,
  ]);
  if (!product) {
    notFound();
  }

  const recommendationsPromise: Promise<ProductRecommendationUiItem[]> = product.id
    ? getProductRecommendations(product.id, locale, countryCode)
        .then(mapProductRecommendationsToUiItems)
        .catch((): ProductRecommendationUiItem[] => [])
    : Promise.resolve([]);

  const headerBadgeKinds = deriveProductBadges({
    availableForSale: product.availableForSale,
    tags: product.tags,
    totalInventory: product.totalInventory,
    quantityAvailable: product.variants[0]?.quantityAvailable,
  });
  const headerBadges = badgeItemsFromKinds(headerBadgeKinds, tBadges);

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
        headerBadges={headerBadges}
        recommendationsPromise={recommendationsPromise}
      />

      <WhyLoveIt />
      <Suspense fallback={null}>
        <CustomerReviews />
      </Suspense>
      <Suspense fallback={<div className="h-64 w-full animate-pulse bg-muted" />}>
        <YouMayAlsoLikeFromPromise
          recommendationsPromise={recommendationsPromise}
          useRecentLocalStorage
          showAddButton
          variant="default"
          title={t("youMayAlsoLike")}
        />
      </Suspense>
    </div>
  );
}
