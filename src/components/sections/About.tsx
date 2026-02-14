import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Image } from "@/components/shared/Image";
import { getTranslations } from "next-intl/server";

export async function About() {
  const t = await getTranslations("about");

  return (
    <section className="py-16 sm:py-20 bg-stone-100">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted/40">
            <Image src="/about-img.jpg" width={500} height={500} alt={t("alt")} className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t("title")}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <Link
              href="/pages/about"
              className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
