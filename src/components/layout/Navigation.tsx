import Link from "next/link";
import clsx from "clsx";

const navLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/blog", label: "Culture" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
];

type NavigationProps = {
  className?: string;
};

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={clsx("flex items-center gap-6 text-sm text-muted-foreground", className)}>
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

