import { CollectionCard } from "./CollectionCard";
import type { CollectionSummary } from "@/lib/shopify/collections";

type CollectionListProps = {
  collections: CollectionSummary[];
};

export function CollectionList({ collections }: CollectionListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard key={collection.handle} {...collection} />
      ))}
    </div>
  );
}
