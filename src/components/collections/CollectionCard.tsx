import type { ShopifyImage } from "@/lib/types/shopify";

type CollectionCardProps = {
  handle: string;
  title: string;
  description?: string | null;
  image?: ShopifyImage | null;
};

export function CollectionCard({ handle, title, description, image }: CollectionCardProps) {
  return (
    <a
      href={`/collections/${handle}`}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow"
    >
      <div className="aspect-[4/3] w-full bg-muted/40">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.altText ?? title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground line-clamp-2">{description}</p> : null}
      </div>
    </a>
  );
}
