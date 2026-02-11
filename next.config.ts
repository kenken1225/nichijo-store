import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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

  // this allows the checkout to work correctly even with a custom domain
  async rewrites() {
    // if the environment variable is not set, return an empty array to avoid build errors
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

export default withNextIntl(nextConfig);
