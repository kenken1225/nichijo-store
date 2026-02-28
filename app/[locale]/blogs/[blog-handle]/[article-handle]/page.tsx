import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { BlogArticleHeader } from "@/components/blogs/BlogArticleHeader";
import { BlogArticleContent } from "@/components/blogs/BlogArticleContent";
import { getBlogArticle, getBlogWithArticles } from "@/lib/shopify/domain/blogs";
import BrowseOtherPages from "@/components/shared/BrowseOtherPages";
import { ContinueReading } from "@/components/blogs/ContinueReading";
import { getTranslations, getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

/// Revalidate
export const revalidate = 3600;

type ArticlePageProps = {
  params: Promise<{ "blog-handle": string; "article-handle": string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { "blog-handle": blogHandle, "article-handle": articleHandle } = await params;
  const data = await getBlogArticle(blogHandle, articleHandle);
  if (!data) return {};

  const title = `${data.article.title} | Nichijo Store`;
  const description = data.article.excerpt?.slice(0, 160) || `${data.article.title} - Nichijo Blog`;
  const imageUrl = data.article.image?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://nichijo-jp.com/blogs/${blogHandle}/${articleHandle}`,
      ...(data.article.publishedAt ? { publishedTime: data.article.publishedAt } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl, alt: data.article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const t = await getTranslations("blogs");
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const { "blog-handle": blogHandle, "article-handle": articleHandle } = await params;
  if (!blogHandle || !articleHandle) {
    notFound();
  }

  const data = await getBlogArticle(blogHandle, articleHandle, locale, countryCode);
  const blogWithArticles = await getBlogWithArticles(blogHandle, locale, countryCode);
  if (!data) {
    notFound();
  }

  const continueArticles =
    blogWithArticles?.articles?.filter((article) => article.handle !== articleHandle)?.slice(0, 3) ?? [];

  // JSON-LD for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.article.title,
    description: data.article.excerpt || "",
    url: `https://nichijo-jp.com/blogs/${blogHandle}/${articleHandle}`,
    ...(data.article.publishedAt ? { datePublished: data.article.publishedAt } : {}),
    ...(data.article.authorName ? { author: { "@type": "Person", name: data.article.authorName } } : {}),
    ...(data.article.image?.url ? { image: data.article.image.url } : {}),
    publisher: {
      "@type": "Organization",
      name: "Nichijo Store",
      url: "https://nichijo-jp.com",
    },
  };

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-secondary/30 py-8 sm:py-12">
        <Container className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <Link href="/blogs" className="hover:underline">
              {t("title")}
            </Link>{" "}
            /{" "}
            <Link href={`/blogs/${data.blogHandle}`} className="hover:underline">
              {data.blogTitle}
            </Link>
          </div>
          <BlogArticleHeader
            title={data.article.title}
            excerpt={data.article.excerpt}
            publishedAt={data.article.publishedAt ?? undefined}
            authorName={data.article.authorName}
            tags={data.article.tags}
            image={data.article.image}
          />
        </Container>
      </section>

      <section className="py-12">
        <Container className="max-w-4xl">
          <BlogArticleContent contentHtml={data.article.contentHtml} />
        </Container>
      </section>

      <section className="py-12 bg-[#E8DFD0]">
        <Container className="max-w-4xl">
          <BrowseOtherPages />
        </Container>
      </section>

      <ContinueReading blogHandle={blogHandle} articles={continueArticles} />
    </div>
  );
}
