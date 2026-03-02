import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TopViewSection } from "@/components/home/TopViewSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { About } from "@/components/home/About";
import { Blog } from "@/components/home/Blog";
import { Trust } from "@/components/home/Trust";
import { VideoSection } from "@/components/home/VideoSection";
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
