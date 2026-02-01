import { Hero } from "@/components/sections/Hero";
import { TopViewSection } from "@/components/sections/TopViewSection";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { About } from "@/components/sections/About";
import { Blog } from "@/components/sections/Blog";
import { CTA } from "@/components/sections/CTA";
import { Trust } from "@/components/sections/Trust";
import { VideoSection } from "@/components/sections/VideoSection";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <TopViewSection />
      <Trust />
      {/* <CategoryGrid /> */}
      <FeaturedProducts />
      <VideoSection />
      <About />
      <Blog />
      {/* <CTA /> */}
    </>
  );
}
