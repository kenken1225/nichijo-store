import Link from "next/link";

type Product = {
  title: string;
  price: string;
  href: string;
};

type Props = {
  products: Product[];
};

export function FeaturedProducts({ products }: Props) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-6 text-xl font-semibold">Featured Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {products.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:shadow"
            >
              <div className="mb-2 h-24 rounded bg-muted/50" />
              <p className="text-base font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
