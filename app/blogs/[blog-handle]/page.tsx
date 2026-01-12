import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { BlogList } from "@/components/blogs/BlogList";
import { BlogSwitcher } from "@/components/blogs/BlogSwitcher";
import { getBlogWithArticles, getBlogs } from "@/lib/shopify/blogs";

// Revalidate
export const revalidate = 3600;

type BlogPageProps = {
  params: Promise<{ "blog-handle": string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { "blog-handle": blogHandle } = await params;
  if (!blogHandle) {
    notFound();
  }

  const [blog, blogs] = await Promise.all([getBlogWithArticles(blogHandle), getBlogs()]);
  if (!blog) {
    notFound();
  }
  const sortedBlogs = blogs.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="bg-background">
      <section className="bg-secondary/30 py-10">
        <Container className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Blog</p>
            <h1 className="text-3xl font-bold text-foreground">{blog.title}</h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Stories, ideas, and moments from Japanese culture and anime
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <div className="flex justify-center">
          <BlogSwitcher blogs={sortedBlogs} currentHandle={blog.handle} />
        </div>
        <Container>
          <BlogList blogHandle={blog.handle} articles={blog.articles} />
        </Container>
      </section>
    </div>
  );
}
