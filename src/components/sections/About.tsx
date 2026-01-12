import Link from "next/link";
import { Container } from "../layout/Container";

export function About() {
  return (
    <section className="py-16">
      <Container className="grid gap-10 md:grid-cols-[1.1fr,1fr] md:items-center">
        <div className="h-64 rounded-lg bg-muted/40 md:h-80" />
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-foreground">Connecting Cultures</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We believe Japanese creativity transcends borders. Every design tells a story, every product carries
            tradition. Our mission is to bring authentic culture-inspired creations to fans worldwide.
          </p>
          <Link
            href="/about"
            className="inline-flex w-fit items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-foreground"
          >
            Our Story
          </Link>
        </div>
      </Container>
    </section>
  );
}
