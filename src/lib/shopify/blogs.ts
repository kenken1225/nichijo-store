import { shopifyFetch, toShopifyLanguage, toShopifyCountry } from "../shopify";
import type { ShopifyArticle, ShopifyBlog } from "../types/shopify";
import { ARTICLE_BY_HANDLE_QUERY, BLOG_BY_HANDLE_QUERY, BLOGS_LIST_QUERY, LATEST_ARTICLES_QUERY, SEARCH_ARTICLES_QUERY } from "./queries";

type BlogsListQuery = {
  blogs: { edges: { node: Pick<ShopifyBlog, "handle" | "title"> }[] };
};

type BlogByHandleQuery = {
  blog:
    | (Pick<ShopifyBlog, "handle" | "title"> & {
        articles: { edges: { node: Omit<ShopifyArticle, "contentHtml" | "author"> }[] };
      })
    | null;
};

type ArticleByHandleQuery = {
  blog:
    | ({
        handle: ShopifyBlog["handle"];
        title: ShopifyBlog["title"];
        articleByHandle: ShopifyArticle | null;
      } & Partial<ShopifyBlog>)
    | null;
};

type SearchArticlesQuery = {
  articles: {
    edges: {
      node: {
        handle: string;
        title: string;
        excerpt: string | null;
        publishedAt: string | null;
        tags: string[];
        image: {
          url: string;
          altText: string | null;
        } | null;
        blog: {
          handle: string;
          title: string;
        };
      };
    }[];
  } | null;
};

export type BlogSummary = Pick<ShopifyBlog, "handle" | "title">;

export type BlogArticleSummary = Omit<ShopifyArticle, "contentHtml" | "author">;

export type BlogWithArticles = BlogSummary & { articles: BlogArticleSummary[] };

export type BlogArticleDetail = BlogArticleSummary & { contentHtml: string; authorName?: string | null };

export type SearchArticleResult = {
  handle: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  tags: string[];
  image: { url: string; altText: string | null } | null;
  blogHandle: string;
};

export async function getBlogs(locale?: string, countryCode?: string): Promise<BlogSummary[]> {
  const data = await shopifyFetch<BlogsListQuery>(BLOGS_LIST_QUERY, { language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  return data?.blogs?.edges?.map(({ node }) => node) ?? [];
}

export async function getBlogWithArticles(handle: string, locale?: string, countryCode?: string): Promise<BlogWithArticles | null> {
  const data = await shopifyFetch<BlogByHandleQuery>(BLOG_BY_HANDLE_QUERY, { handle, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  if (!data?.blog) return null;

  const articles =
    data.blog.articles?.edges?.map(({ node }) => ({
      handle: node.handle,
      title: node.title,
      excerpt: node.excerpt ?? null,
      publishedAt: node.publishedAt ?? null,
      tags: node.tags ?? [],
      image: node.image ?? null,
    })) ?? [];

  return {
    handle: data.blog.handle,
    title: data.blog.title,
    articles,
  };
}

export async function getBlogArticle(
  blogHandle: string,
  articleHandle: string,
  locale?: string,
  countryCode?: string
): Promise<{ blogHandle: string; blogTitle: string; article: BlogArticleDetail } | null> {
  const data = await shopifyFetch<ArticleByHandleQuery>(ARTICLE_BY_HANDLE_QUERY, {
    blogHandle,
    articleHandle,
    language: toShopifyLanguage(locale),
    country: toShopifyCountry(countryCode),
  });
  const article = data?.blog?.articleByHandle;
  if (!data?.blog || !article) return null;

  return {
    blogHandle: data.blog.handle,
    blogTitle: data.blog.title,
    article: {
      handle: article.handle,
      title: article.title,
      excerpt: article.excerpt ?? null,
      contentHtml: article.contentHtml ?? "",
      publishedAt: article.publishedAt ?? null,
      tags: article.tags ?? [],
      image: article.image ?? null,
      authorName: article.author?.name ?? null,
    },
  };
}

export async function searchArticles(query: string, locale?: string, countryCode?: string): Promise<SearchArticleResult[]> {
  const data = await shopifyFetch<SearchArticlesQuery>(SEARCH_ARTICLES_QUERY, { query, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  const articles = data?.articles?.edges ?? [];

  return articles.map(({ node }) => ({
    handle: node.handle,
    title: node.title,
    excerpt: node.excerpt ?? null,
    publishedAt: node.publishedAt ?? null,
    tags: node.tags ?? [],
    image: node.image ?? null,
    blogHandle: node.blog.handle,
  }));
}

type LatestArticlesQuery = {
  articles: {
    edges: {
      node: {
        handle: string;
        title: string;
        excerpt: string | null;
        publishedAt: string | null;
        tags: string[];
        image: {
          url: string;
          altText: string | null;
          width?: number;
          height?: number;
        } | null;
        blog: {
          handle: string;
          title: string;
        };
      };
    }[];
  } | null;
};

export type LatestArticle = {
  handle: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  tags: string[];
  image: { url: string; altText: string | null } | null;
  blogHandle: string;
  blogTitle: string;
};

export async function getLatestArticles(count: number = 3, locale?: string, countryCode?: string): Promise<LatestArticle[]> {
  const data = await shopifyFetch<LatestArticlesQuery>(LATEST_ARTICLES_QUERY, { first: count, language: toShopifyLanguage(locale), country: toShopifyCountry(countryCode) });
  const articles = data?.articles?.edges ?? [];

  return articles.map(({ node }) => ({
    handle: node.handle,
    title: node.title,
    excerpt: node.excerpt ?? null,
    publishedAt: node.publishedAt ?? null,
    tags: node.tags ?? [],
    image: node.image ?? null,
    blogHandle: node.blog.handle,
    blogTitle: node.blog.title,
  }));
}
