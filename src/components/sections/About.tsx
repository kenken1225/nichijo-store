import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Image } from "@/components/shared/Image";

export function About() {
  return (
    <section className="py-16 sm:py-20 bg-stone-100">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted/40">
            <Image src="/about-img.jpg" width={500} height={500} alt="Japanese culture" className="object-cover" />
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Connecting Cultures</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We believe Japanese creativity transcends borders. From traditional craft to pop culture, every piece
              tells a story. Our mission is to share authentic Japanese creations with those who love the culture.
            </p>
            <Link
              href="/pages/about"
              className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Our Story
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
