import { shopifyFetch } from "../shopify";
import type { ShopifyArticle, ShopifyBlog } from "../types/shopify";
import { ARTICLE_BY_HANDLE_QUERY, BLOG_BY_HANDLE_QUERY, BLOGS_LIST_QUERY } from "./queries";

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

export type BlogSummary = Pick<ShopifyBlog, "handle" | "title">;

export type BlogArticleSummary = Omit<ShopifyArticle, "contentHtml" | "author">;

export type BlogWithArticles = BlogSummary & { articles: BlogArticleSummary[] };

export type BlogArticleDetail = BlogArticleSummary & { contentHtml: string; authorName?: string | null };

export async function getBlogs(): Promise<BlogSummary[]> {
  const data = await shopifyFetch<BlogsListQuery>(BLOGS_LIST_QUERY);
  return data?.blogs?.edges?.map(({ node }) => node) ?? [];
}

export async function getBlogWithArticles(handle: string): Promise<BlogWithArticles | null> {
  const data = await shopifyFetch<BlogByHandleQuery>(BLOG_BY_HANDLE_QUERY, { handle });
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
  articleHandle: string
): Promise<{ blogHandle: string; blogTitle: string; article: BlogArticleDetail } | null> {
  const data = await shopifyFetch<ArticleByHandleQuery>(ARTICLE_BY_HANDLE_QUERY, {
    blogHandle,
    articleHandle,
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
