import Link from "next/link";
import type { BlogArticleSummary } from "@/lib/shopify/domain/blogs";
import { formatDate } from "@/lib/shopify/client";
import { Image } from "@/components/shared/Image";
import { ArticleNewBadge, isNewArticle } from "./ArticleNewBadge";
import { getTranslations } from "next-intl/server";

type BlogArticleCardProps = {
  blogHandle: string;
  article: BlogArticleSummary;
};

export async function BlogArticleCard({ blogHandle, article }: BlogArticleCardProps) {
  const t = await getTranslations("blogs");
  return (
    <Link
      href={`/blogs/${blogHandle}/${article.handle}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-muted/40">
        <ArticleNewBadge show={isNewArticle(article.publishedAt)} label={t("badgeNew")} className="absolute left-2 top-2 z-10" />
        {article.image?.url ? (
          <Image
            src={article.image.url}
            alt={article.image.altText ?? article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="text-xs font-medium text-muted-foreground">
          {formatDate(article.publishedAt ?? "", "en-US")}
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground line-clamp-2">{article.title}</h3>
          {article.excerpt ? <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p> : null}
        </div>

        <div className="mt-auto text-sm font-semibold text-primary">{t("readMore")}</div>
      </div>
    </Link>
  );
}　
