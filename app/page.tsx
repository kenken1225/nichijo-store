import { Hero } from "@/components/sections/Hero";
import { Trust } from "@/components/sections/Trust";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { About } from "@/components/sections/About";
import { Blog } from "@/components/sections/Blog";
import { CTA } from "@/components/sections/CTA";
import { getProductsList } from "@/lib/shopify/products";

const mockPosts = [
  {
    title: "The Art of Wabi-Sabi in Modern Design",
    excerpt: "Exploring how traditional aesthetics influence contemporary anime art.",
    href: "/blog/wabi-sabi-design",
  },
  {
    title: "Behind the Scenes: Artist Collaborations",
    excerpt: "Meet the creators bringing unique visions to life through limited drops.",
    href: "/blog/artist-collaborations",
  },
  {
    title: "Street Culture: Tokyo to the World",
    excerpt: "How urban Japanese fashion trends inspire global merchandise design.",
    href: "/blog/street-culture",
  },
];

export default async function Home() {
  const featuredProducts = await getProductsList(4);

  return (
    <>
      <Hero />
      <Trust />
      <CategoryGrid />
      <FeaturedProducts
        products={featuredProducts.map((p) => ({
          title: p.title,
          price: p.priceFormatted,
          href: `/products/${p.handle}`,
        }))}
      />
      <About />
      <Blog posts={mockPosts} />
      <CTA />
    </>
  );
}
