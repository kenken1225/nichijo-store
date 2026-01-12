import Link from "next/link";
import { BlogArticleCard } from "./BlogArticleCard";
import type { BlogArticleSummary } from "@/lib/shopify/blogs";
import { Container } from "../layout/Container";

type BlogListProps = {
  blogHandle: string;
  articles: BlogArticleSummary[];
};

export function BlogList({ blogHandle, articles }: BlogListProps) {
  const featured = articles[0];
  const rest = featured ? articles.slice(1) : articles;

  return (
    <div className="bg-background">
      <section className="py-10">
        <Container className="space-y-8 !px-0">
          {featured ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
                <div className="relative aspect-[4/3] w-full bg-muted/40 md:aspect-auto md:min-h-[360px]">
                  {featured.image?.url ? (
                    <img
                      src={featured.image.url}
                      alt={featured.image.altText ?? featured.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                  <span className="absolute left-4 top-4 rounded-full bg-[#e9dece] px-3 py-1 text-xs font-semibold text-[#c47a57]">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col gap-4 px-6 py-8 sm:px-8 sm:py-10">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(featured.publishedAt ?? "").toDateString()}
                    </p>
                    <h2 className="text-2xl font-semibold text-foreground leading-tight">{featured.title}</h2>
                    {featured.excerpt ? (
                      <p className="text-sm text-muted-foreground leading-6">{featured.excerpt}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/blogs/${blogHandle}/${featured.handle}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {rest.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <BlogArticleCard key={article.handle} blogHandle={blogHandle} article={article} />
              ))}
            </div>
          ) : !featured ? (
            <div className="rounded-lg border border-border bg-card px-4 py-10 text-center text-muted-foreground">
              There are no articles in this category yet. Please check another category.
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
