import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getCountryCode } from "@/lib/country-config";
import { getProductByHandle } from "@/lib/shopify/products";
import { ProductDetailSkeleton } from "@/components/skeletons";
import { ProductContent } from "@/components/products/ProductContent";

export const revalidate = 3600;

const getSiteUrl = () => process.env.SITE_URL ?? "https://nichijo-jp.com";

type ProductPageProps = {
  params: Promise<{ locale: string; handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, handle } = await params;
  const countryCode = await getCountryCode();
  const product = await getProductByHandle(handle, locale, countryCode);
  if (!product) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const title = `${product.title} | Nichijo Store`;
  const description = product.description?.slice(0, 160) || `${product.title} - Nichijo Japanese Shop`;
  const imageUrl = product.featuredImage?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/products/${handle}`,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: product.title }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  if (!handle) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductContent handle={handle} />
    </Suspense>
  );
}
