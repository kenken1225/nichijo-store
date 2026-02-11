import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionFilters } from "@/components/collections/filters/CollectionFilters";
import { getCollectionWithProducts } from "@/lib/shopify/collections";
import { CollectionSkeleton } from "@/components/skeletons";
import { getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

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
