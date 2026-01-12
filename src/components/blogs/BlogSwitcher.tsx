import Link from "next/link";

type BlogSwitcherProps = {
  blogs: { handle: string; title: string }[];
  currentHandle: string;
};

export function BlogSwitcher({ blogs, currentHandle }: BlogSwitcherProps) {
  if (!blogs.length) return null;

  const sortedBlogs = Array.from(blogs).sort((a, b) => {
    if (a.handle === "news" && b.handle !== "news") return -1;
    if (a.handle !== "news" && b.handle === "news") return 1;
    return 0;
  });

  return (
    <div className="flex flex-wrap gap-3">
      {sortedBlogs.map((blog) => {
        const active = blog.handle === currentHandle;
        return (
          <Link
            key={blog.handle}
            href={`/blogs/${blog.handle}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active ? "bg-[#26293b] text-white shadow-sm" : "bg-[#e9dece] text-foreground hover:opacity-90"
            }`}
          >
            {blog.title}
          </Link>
        );
      })}
    </div>
  );
}
