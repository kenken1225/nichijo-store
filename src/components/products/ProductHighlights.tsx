import { getTranslations } from "next-intl/server";

type ProductHighlightsProps = {
  items: string[];
};

export async function ProductHighlights({ items }: ProductHighlightsProps) {
  const t = await getTranslations("product");
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground">{t("highlights")}</h3>
      <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
