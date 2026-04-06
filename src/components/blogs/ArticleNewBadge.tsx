const NEW_BADGE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function isNewArticle(publishedAt?: string | null): boolean {
  if (!publishedAt) return false;
  const pub = new Date(publishedAt).getTime();
  return !Number.isNaN(pub) && Date.now() - pub <= NEW_BADGE_MAX_AGE_MS;
}

type ArticleNewBadgeProps = {
  show: boolean;
  label: string;
  className?: string;
};

export function ArticleNewBadge({ show, label, className = "" }: ArticleNewBadgeProps) {
  if (!show) return null;

  return (
    <span
      className={`inline-block rounded bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-xs ${className}`.trim()}
    >
      {label}
    </span>
  );
}
