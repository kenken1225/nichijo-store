import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionFilters } from "@/components/collections/filters/CollectionFilters";
import { CollectionPagination } from "@/components/collections/CollectionPagination";
import { getCollectionWithProducts } from "@/lib/shopify/domain/collections";
import { CollectionSkeleton } from "@/components/skeletons";
import { getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

export const revalidate = 3600;

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ after?: string; before?: string; p?: string }>;
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

async function CollectionContent({
  handle,
  searchParams,
}: {
  handle: string;
  searchParams: { after?: string; before?: string; p?: string };
}) {
  const locale = await getLocale();
  const countryCode = await getCountryCode();

  const page = Math.max(1, parseInt(searchParams.p ?? "1", 10) || 1);
  const before = searchParams.before;
  const after = before ? undefined : searchParams.after;

  const collection = await getCollectionWithProducts(handle, {
    locale,
    countryCode,
    after,
    before,
  });

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
          <CollectionPagination handle={handle} page={page} pageInfo={collection.pageInfo} />
        </Container>
      </section>
    </div>
  );
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { handle } = await params;
  const sp = await searchParams;
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent handle={handle} searchParams={sp} />
    </Suspense>
  );
}
