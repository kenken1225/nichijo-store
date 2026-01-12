type ActiveFiltersProps = {
  selectedCategory: string | null;
  priceLabel: string | null;
  inStockOnly: boolean;
  onClearCategory: () => void;
  onClearPrice: () => void;
  onClearInStock: () => void;
  onClearAll: () => void;
};

export function ActiveFilters({
  selectedCategory,
  priceLabel,
  inStockOnly,
  onClearCategory,
  onClearPrice,
  onClearInStock,
  onClearAll,
}: ActiveFiltersProps) {
  const hasPrice = !!priceLabel;
  const hasAny = !!selectedCategory || hasPrice || inStockOnly;

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {selectedCategory ? <FilterChip label={`Category: ${selectedCategory}`} onClear={onClearCategory} /> : null}
      {hasPrice ? <FilterChip label={`Price: ${priceLabel}`} onClear={onClearPrice} /> : null}
      {inStockOnly ? <FilterChip label="In stock" onClear={onClearInStock} /> : null}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-muted/70"
      >
        Clear all
      </button>
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
      {label}
      <button type="button" onClick={onClear} className="text-primary hover:text-primary/70">
        ×
      </button>
    </span>
  );
}
