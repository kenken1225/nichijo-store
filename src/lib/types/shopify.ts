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

// ProductPageの型定義
