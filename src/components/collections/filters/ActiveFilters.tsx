import { useTranslations } from "next-intl";

export type AppliedFilterChip = {
  inputKey: string;
  label: string;
};

type ActiveFiltersProps = {
  chips: AppliedFilterChip[];
  onClearChip: (inputKey: string) => void;
  onClearAll: () => void;
};

export function ActiveFilters({ chips, onClearChip, onClearAll }: ActiveFiltersProps) {
  const t = useTranslations("collections");
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {chips.map((c) => (
        <FilterChip key={c.inputKey} label={c.label} onClear={() => onClearChip(c.inputKey)} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
      >
        {t("clearAll")}
      </button>
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
      <span className="min-w-0 truncate">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 rounded-full px-1 text-primary hover:bg-primary/15"
        aria-label="Remove filter"
      >
        ×
      </button>
    </span>
  );
}
