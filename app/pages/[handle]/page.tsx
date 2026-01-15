import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { getPages } from "@/lib/shopify/pages";

// Revalidate
export const revalidate = 3600;

export default async function PagesPage() {
  const pages = await getPages();

  const newsBlog = blogs.find((b) => b.handle.toLowerCase() === "news");
  if (newsBlog) {
    redirect(`/blogs/${newsBlog.handle}`);
  }

  return (
    <div className="bg-background">
      <section className="bg-secondary/40 py-14">
        <Container className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Blogs</p>
          <h1 className="text-3xl font-bold text-foreground">Blogs List</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Browse our curated collections inspired by everyday moments in Japan.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {blogs.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog.handle}
                  href={`/blogs/${blog.handle}`}
                  className="flex h-full flex-col justify-between rounded-lg border border-border bg-card px-5 py-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">Blog</p>
                    <h2 className="text-xl font-semibold text-foreground">{blog.title}</h2>
                  </div>
                  <span className="mt-4 text-sm font-semibold text-primary">View articles →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-4 py-10 text-center text-muted-foreground">
              There are no blogs yet. Please prepare articles on the Shopify side and then check again.
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
