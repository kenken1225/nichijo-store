type CollectionHeaderProps = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
};

export function CollectionHeader({ title, description, imageUrl }: CollectionHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm">
      <div
        className="h-[240px] w-full bg-cover bg-center sm:h-[280px] md:h-[320px]"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-black/30 via-black/25 to-black/40 px-4 text-center">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-white/80">Collections</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
            {description ? <p className="text-sm text-white/90 sm:text-base">{description}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
