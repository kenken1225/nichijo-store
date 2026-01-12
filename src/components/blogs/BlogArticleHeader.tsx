import type { ShopifyImage } from "@/lib/types/shopify";

type BlogArticleHeaderProps = {
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  authorName?: string | null;
  tags: string[];
  image?: ShopifyImage | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(date);
};

export function BlogArticleHeader({ title, excerpt, publishedAt, authorName, tags, image }: BlogArticleHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {image?.url ? (
        <div className="relative aspect-[16/9] w-full bg-muted/40">
          <img
            src={image.url}
            alt={image.altText ?? title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
        </div>
      ) : null}

      <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(publishedAt)}</span>
          {authorName ? <span>・ {authorName}</span> : null}
        </div>

        <h1 className="text-3xl font-bold text-foreground leading-tight sm:text-4xl">{title}</h1>

        {excerpt ? <p className="text-base text-muted-foreground sm:text-lg">{excerpt}</p> : null}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground/80">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


