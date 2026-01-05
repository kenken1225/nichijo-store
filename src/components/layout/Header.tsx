import Link from "next/link";
import { Container } from "./Container";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
          KŌBAI
        </Link>
        <Navigation />
      </Container>
    </header>
  );
}
