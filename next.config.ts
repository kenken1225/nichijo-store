import type { NextConfig } from "next";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

const nextConfig: NextConfig = {
  images: {
    // Shopify配信の画像を許可（自ショップのサブドメインとCDN）
    remotePatterns: [
      { protocol: "https", hostname: "*.myshopify.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // /cart/c/* へのリクエストをShopifyのチェックアウトサーバーにプロキシ
  // これにより、カスタムドメインでもShopifyのチェックアウトが正しく動作する
  async rewrites() {
    // 環境変数が設定されていない場合は空配列を返す（ビルドエラー回避）
    if (!SHOPIFY_STORE_DOMAIN) {
      console.warn("SHOPIFY_STORE_DOMAIN is not set. Checkout rewrites will not work.");
      return [];
    }

    return [
      {
        source: "/cart/c/:path*",
        destination: `https://${SHOPIFY_STORE_DOMAIN}/cart/c/:path*`,
      },
      {
        source: "/checkout/:path*",
        destination: `https://${SHOPIFY_STORE_DOMAIN}/checkout/:path*`,
      },
    ];
  },
};

export default nextConfig;
