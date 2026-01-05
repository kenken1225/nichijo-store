import Link from "next/link";
import { Container } from "./Container";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/collections", label: "Collections" },
      { href: "/collections?filter=best", label: "Best Sellers" },
      { href: "/collections?filter=sale", label: "Sale" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/shipping-returns", label: "Shipping Info" },
      { href: "/shipping-returns", label: "Returns" },
      { href: "/FAQ", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Culture Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "https://www.instagram.com", label: "Instagram" },
      { href: "https://twitter.com", label: "Twitter" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/60 py-12">
      <Container className="grid gap-10 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">{col.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="mt-10 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
        <span>© 2024 KŌBAI. All rights reserved.</span>
        <div className="space-x-3">
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </Container>
    </footer>
  );
}
