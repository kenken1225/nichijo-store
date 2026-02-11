import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { BlogArticleSummary } from "@/lib/shopify/blogs";
import { formatDate } from "@/lib/shopify";
import { getTranslations } from "next-intl/server";

type Props = {
  blogHandle: string;
  articles: BlogArticleSummary[];
};

export async function ContinueReading({ blogHandle, articles }: Props) {
  const t = await getTranslations("blogs");
  if (!articles.length) return null;

  return (
    <section className="bg-secondary/20 py-16">
      <Container className="space-y-10">
        <h2 className="text-center text-3xl font-semibold text-foreground">{t("continueReading")}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.handle}
              href={`/blogs/${blogHandle}/${article.handle}`}
              className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted/40">
                {article.image?.url ? (
                  <img
                    src={article.image.url}
                    alt={article.image.altText ?? article.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{formatDate(article.publishedAt ?? "", "en-US")}</p>
                <h3 className="text-lg font-semibold text-foreground leading-tight line-clamp-2">{article.title}</h3>
                {article.excerpt ? (
                  <p className="text-sm text-muted-foreground leading-6 line-clamp-3">{article.excerpt}</p>
                ) : null}
              </div>
              <span className="mt-auto text-sm font-semibold text-primary">{t("readMore")}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
