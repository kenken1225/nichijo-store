import Link from "next/link";
import { BlogArticleCard } from "@/components/blogs/BlogArticleCard";
import { getLatestArticles } from "@/lib/shopify/blogs";
import { Container } from "@/components/layout/Container";

export async function Blog() {
  const articles = await getLatestArticles(3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Latest Articles</h2>
          <Link
            href="/blogs/news"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogArticleCard
              key={`${article.blogHandle}-${article.handle}`}
              blogHandle={article.blogHandle}
              article={{
                handle: article.handle,
                title: article.title,
                excerpt: article.excerpt,
                publishedAt: article.publishedAt,
                tags: article.tags,
                image: article.image,
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
