import { useTranslations } from "next-intl";

type AvailabilityFilterProps = {
  inStockOnly: boolean;
  onToggle: (next: boolean) => void;
};

export function AvailabilityFilter({ inStockOnly, onToggle }: AvailabilityFilterProps) {
  const t = useTranslations("collections");
  return (
    <label className="flex items-center gap-3 text-sm text-foreground">
      <input
        type="checkbox"
        checked={inStockOnly}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      <span>{t("inStockOnly")}</span>
    </label>
  );
}
