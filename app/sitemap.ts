import type { MetadataRoute } from "next";
import { getProductsList } from "@/lib/shopify/domain/products";
import { getCollections } from "@/lib/shopify/domain/collections";
import { getBlogs, getBlogWithArticles } from "@/lib/shopify/domain/blogs";

const getSiteUrl = () => process.env.SITE_URL ?? "https://nichijo-jp.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = getSiteUrl();
  // static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // product pages
  const products = await getProductsList(100);
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Collection Page
  const collections = await getCollections();
  const collectionPages: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${SITE_URL}/collections/${collection.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // blog article pages
  const blogs = await getBlogs();
  const articlePages: MetadataRoute.Sitemap = [];

  for (const blog of blogs) {
    const blogWithArticles = await getBlogWithArticles(blog.handle);
    if (blogWithArticles?.articles) {
      for (const article of blogWithArticles.articles) {
        articlePages.push({
          url: `${SITE_URL}/blogs/${blog.handle}/${article.handle}`,
          lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    }
  }

  return [...staticPages, ...productPages, ...collectionPages, ...articlePages];
}
