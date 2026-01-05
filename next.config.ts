import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Shopify配信の画像を許可（自ショップのサブドメインとCDN）
    remotePatterns: [
      { protocol: "https", hostname: "*.myshopify.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
