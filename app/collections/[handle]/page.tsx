import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionFilters } from "@/components/collections/filters/CollectionFilters";
import { getCollectionWithProducts } from "@/lib/shopify/collections";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  if (!handle) {
    notFound();
  }

  const collection = await getCollectionWithProducts(handle);
  if (!collection) {
    notFound();
  }

  return (
    <div className="bg-background">
      <section className="py-6 sm:py-10">
        <Container>
          <CollectionHeader
            title={collection.title}
            description={collection.description}
            imageUrl={collection.image?.url}
          />
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
