import clsx from "clsx";

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  if (!categories.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={clsx(
            "w-full rounded-md border px-3 py-2 text-sm text-left transition",
            selectedCategory === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:border-foreground/60"
          )}
        >
          All
        </button>
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={clsx(
                "w-full rounded-md border px-3 py-2 text-sm text-left transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/60"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
