import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionFilters } from "@/components/collections/filters/CollectionFilters";
import { getCollectionWithProducts } from "@/lib/shopify/domain/collections";
import { CollectionSkeleton } from "@/components/skeletons";
import { getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionWithProducts(handle);
  if (!collection) return {};

  const title = `${collection.title} | Nichijo Store`;
  const description = collection.description?.slice(0, 160) || `${collection.title} - Nichijo Japanese Shop`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://nichijo-jp.com/collections/${handle}`,
    },
  };
}

async function CollectionContent({ handle }: { handle: string }) {
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const collection = await getCollectionWithProducts(handle, locale, countryCode);
  if (!collection) {
    notFound();
  }

  return (
    <div className="bg-background">
      <section className="py-6 sm:py-10 bg-secondary/60">
        <Container>
          <CollectionHeader title={collection.title} description={collection.description} />
        </Container>
      </section>

      <section className="py-12">
        <Container className="space-y-8">
          <CollectionFilters products={collection.products} />
        </Container>
      </section>
    </div>
  );
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent handle={handle} />
    </Suspense>
  );
}
