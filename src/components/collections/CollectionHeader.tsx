type CollectionHeaderProps = {
  title: string;
  description?: string | null;
};

export function CollectionHeader({ title, description }: CollectionHeaderProps) {
  return (
    <div className="space-y-3 text-center">
      {/* <p className="text-sm uppercase tracking-wide text-muted-foreground">Collections</p> */}
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {description ? <p className="text-base text-muted-foreground max-w-2xl mx-auto">{description}</p> : null}
    </div>
  );
}
