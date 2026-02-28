import { Container } from "@/components/layout/Container";
import { getTranslations } from "next-intl/server";

export async function TopViewSection() {
  const t = await getTranslations("topView");

  return (
    <section className="py-16 sm:py-20 text-center">
      <Container className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">{t("title")}</h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {t("line1")} <br />
          {t("line2")}
        </p>
      </Container>
    </section>
  );
}
