import { Container } from "@/components/layout/Container";

export function TopViewSection() {
  return (
    <section className="py-16 sm:py-20 text-center">
      <Container className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">The Quiet Beauty of Everyday Japan</h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Not trends. Not souvenirs. <br />
          Just meaningful pieces of Japan.
        </p>
      </Container>
    </section>
  );
}
