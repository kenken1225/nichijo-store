type BlogArticleContentProps = {
  contentHtml: string;
};

export function BlogArticleContent({ contentHtml }: BlogArticleContentProps) {
  return (
    <div
      className="page-common-container space-y-6 prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-lg prose-blockquote:border-s-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/60 prose-blockquote:px-4 prose-blockquote:py-3"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
