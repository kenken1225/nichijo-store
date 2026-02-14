import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TopViewSection } from "@/components/sections/TopViewSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { About } from "@/components/sections/About";
import { Blog } from "@/components/sections/Blog";
import { Trust } from "@/components/sections/Trust";
import { VideoSection } from "@/components/sections/VideoSection";
import { CustomerReviews } from "@/components/products/CustomerReviews";
import { Suspense } from "react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nichijo Store | Japanese Products & Lifestyle",
  description:
    "Discover authentic Japanese products at Nichijo Store. From matcha to traditional crafts, we bring the best of Japan to your doorstep.",
  openGraph: {
    title: "Nichijo Store | Japanese Products & Lifestyle",
    description:
      "Discover authentic Japanese products at Nichijo Store. From matcha to traditional crafts, we bring the best of Japan to your doorstep.",
    type: "website",
    url: "https://nichijo-jp.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <TopViewSection />
      <Trust />
      <FeaturedProducts />
      <VideoSection />
      <Suspense fallback={null}>
        <CustomerReviews />
      </Suspense>
      <About />
      <Blog />
    </>
  );
}
