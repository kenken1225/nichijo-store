type Post = {
  title: string;
  excerpt: string;
  href: string;
};

type Props = {
  posts: Post[];
};

export function Blog({ posts }: Props) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-6 text-xl font-semibold">Blog</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              className="flex h-full flex-col rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:shadow"
            >
              <h3 className="mb-2 text-lg font-medium text-foreground">{post.title}</h3>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}



