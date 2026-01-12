import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
};

export function ProductBreadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
            {index < items.length - 1 ? <span className="opacity-60">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
