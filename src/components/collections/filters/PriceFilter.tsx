import { useTranslations } from "next-intl";

type PriceOption = { key: string; label: string; min: number | null; max: number | null };

type PriceFilterProps = {
  options: PriceOption[];
  value: string | null;
  onChange: (key: string | null) => void;
};

export function PriceFilter({ options, value, onChange }: PriceFilterProps) {
  const t = useTranslations("collections");
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("priceRange")}</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="price-range"
              value={opt.key}
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
              className="h-4 w-4 accent-primary"
            />
            <span>{opt.label}</span>
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="price-range"
            value="all"
            checked={value === null}
            onChange={() => onChange(null)}
            className="h-4 w-4 accent-primary"
          />
          <span>{t("all")}</span>
        </label>
      </div>
    </div>
  );
}
