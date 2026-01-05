type Props = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function ProductCard({ title, price, href, imageUrl, imageAlt }: Props) {
  return (
    <a
      href={href}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow"
    >
      <div className="aspect-[4/5] w-full bg-muted/50">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={imageAlt ?? title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 py-3">
        <p className="text-base font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{price}</p>
      </div>
    </a>
  );
}

