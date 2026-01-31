import Link from "next/link";
import { Image } from "@/components/shared/Image";

type Props = {
  title: string;
  price: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  secondaryImageUrl?: string | null;
};

export function ProductCard({ title, price, href, imageUrl, imageAlt, secondaryImageUrl }: Props) {
  const hasSecondaryImage = !!secondaryImageUrl;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow"
    >
      <div className="aspect-[4/5] w-full bg-muted/50 relative overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-300 ${
                hasSecondaryImage ? "group-hover:opacity-0" : ""
              }`}
            />
            {hasSecondaryImage && (
              <Image
                src={secondaryImageUrl ?? ""}
                alt={imageAlt ?? title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 py-3">
        <p className="text-base font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{price}</p>
      </div>
    </Link>
  );
}
