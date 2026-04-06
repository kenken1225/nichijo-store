import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { BlogPostCard } from "@/components/blogs/BlogPostCard";
import { formatDate } from "@/lib/shopify/client";
import { isNewArticle } from "./ArticleNewBadge";
import type { LatestArticle } from "@/lib/shopify/domain/blogs";

type BlogRecentPostsSectionProps = {
  items: LatestArticle[];
  sectionTitle: string;
};

export async function BlogRecentPostsSection({ items, sectionTitle }: BlogRecentPostsSectionProps) {
  if (!items.length) return null;

  const t = await getTranslations("blogs");
  const locale = await getLocale();
  const dateLocale = locale === "ar" ? "ar" : "en-US";
  const multiBlog = new Set(items.map((i) => i.blogHandle)).size > 1;
  const newLabel = t("badgeNew");

  const cards = items.map((item) => {
    const dateStr = item.publishedAt ? formatDate(item.publishedAt, dateLocale) : "";
    const meta = multiBlog && item.blogTitle ? `${item.blogTitle} · ${dateStr}` : dateStr;
    return (
      <BlogPostCard
        key={`${item.blogHandle}-${item.handle}`}
        title={item.title}
        meta={meta}
        href={`/blogs/${item.blogHandle}/${item.handle}`}
        imageUrl={item.image?.url}
        imageAlt={item.image?.altText ?? item.title}
        isNew={isNewArticle(item.publishedAt)}
        newLabel={newLabel}
      />
    );
  });

  return (
    <section className="bg-secondary/15 py-12">
      <Container className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-foreground">{sectionTitle}</h2>
        </div>
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          {cards.map((card) => (
            <div key={card.key} className="min-w-[240px] snap-start">
              {card}
            </div>
          ))}
        </div>
        {items.length >= 4 ? (
          <div className="hidden md:flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {cards.map((card) => (
              <div key={card.key} className="min-w-[240px] flex-shrink-0 snap-start">
                {card}
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden md:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards}</div>
        )}
      </Container>
    </section>
  );
}
