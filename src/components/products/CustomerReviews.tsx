import { Container } from "@/components/layout/Container";
import { fetchJudgeMeReviews } from "@/lib/judgeme";
import { ReviewCarousel } from "./ReviewCarousel";
import { getTranslations } from "next-intl/server";

export async function CustomerReviews() {
  const reviews = await fetchJudgeMeReviews(10);

  if (reviews.length === 0) return null;

  // "reviews" は en.json / ar.json の "reviews" キーに対応する
  const t = await getTranslations("reviews");

  return (
    <section className="bg-secondary/20 py-12">
      <Container className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            {t("title")}
          </h2>
        </div>

        <ReviewCarousel reviews={reviews} />
      </Container>
    </section>
  );
}
