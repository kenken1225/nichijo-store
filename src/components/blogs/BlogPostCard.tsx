import Link from "next/link";
import { Image } from "@/components/shared/Image";
import { ArticleNewBadge } from "./ArticleNewBadge";

type BlogPostCardProps = {
  title: string;
  meta: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  isNew: boolean;
  newLabel: string;
};

export function BlogPostCard({ title, meta, href, imageUrl, imageAlt, isNew, newLabel }: BlogPostCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/50">
        <ArticleNewBadge show={isNew} label={newLabel} className="absolute left-2 top-2 z-10" />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 py-3">
        <p className="text-base font-medium text-foreground line-clamp-2">{title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{meta}</p>
      </div>
    </Link>
  );
}
