export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ShopifyPrice = {
  amount: string;
  currencyCode: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  price: ShopifyPrice;
  availableForSale?: boolean;
  quantityAvailable?: number | null;
  selectedOptions?: { name: string; value: string }[];
};

export type ShopifyProduct = {
  handle: string;
  title: string;
  description: string;
  featuredImage?: ShopifyImage | null;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
};

export type ShopifyArticleAuthor = {
  name: string;
};

export type ShopifyArticle = {
  handle: string;
  title: string;
  excerpt?: string | null;
  contentHtml?: string | null;
  image?: ShopifyImage | null;
  publishedAt?: string | null;
  tags: string[];
  author?: ShopifyArticleAuthor | null;
};

export type ShopifyBlog = {
  handle: string;
  title: string;
  articles?: ShopifyArticle[];
};

export type ShopifyPage = {
  title: string;
  handle: string;
  contentHtml?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
};
