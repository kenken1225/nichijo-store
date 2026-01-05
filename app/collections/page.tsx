import { Container } from "@/components/layout/Container";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionList } from "@/components/collections/CollectionList";
import { getCollections } from "@/lib/shopify/collections";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="bg-background">
      <section className="bg-secondary/40 py-14">
        <Container className="space-y-4">
          <CollectionHeader
            title="Collections"
            description="Browse our curated collections inspired by everyday moments in Japan."
          />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <CollectionList collections={collections} />
        </Container>
      </section>
    </div>
  );
}
