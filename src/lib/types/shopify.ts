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
  image?: ShopifyImage | null;
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

export type ShopifyPagesList = {
  title: string;
  handle: string;
};

export type ShopifyPage = {
  title: string;
  handle?: string;
  body?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

export type ShopifyPolicies = {
  title: string;
  handle?: string;
  body?: string | null;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
  };
  buyerIdentity: {
    email?: string | null;
    countryCode?: string | null;
  };
  attributes: {
    key: string;
    value: string;
  }[];
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
  };
  merchandise: CartLineMerchandise;
  attributes: {
    key: string;
    value: string;
  }[];
};

export type CartLineMerchandise = {
  id: string;
  title: string;
  availableForSale?: boolean;
  price: ShopifyPrice;
  selectedOptions?: { name: string; value: string }[];
  product: {
    id: string;
    title: string;
    handle: string;
    featuredImage?: ShopifyImage | null;
  };
  image?: ShopifyImage | null;
};

export type CartApiResponse = {
  lines?: CartLine[] | { edges?: { node: CartLine }[] };
  cost?: { subtotalAmount: ShopifyPrice; totalAmount?: ShopifyPrice };
  checkoutUrl?: string;
  totalQuantity?: number;
};

export type MiniCartLine = {
  id: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type ParsedCart = {
  lines: MiniCartLine[];
  subtotal: string;
  checkoutUrl: string | null;
  totalQuantity: number;
};
