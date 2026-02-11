import { Container } from "@/components/layout/Container";
import { redirect } from "next/navigation";
import { getPageList } from "@/lib/shopify/pages";
import { getTranslations, getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

// Revalidate
export const revalidate = 3600;

export default async function PagesPage() {
  const t = await getTranslations("pages");
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const pages = await getPageList(locale, countryCode);
  const getPagesToAbout = pages.find((page) => page.handle.toLowerCase() === "about");
  if (getPagesToAbout) {
    redirect(`/pages/${getPagesToAbout.handle}`);
  }

  return (
    <div className="bg-background">
      <section className="py-12">
        <Container>
          <div className="rounded-lg border border-border bg-card px-4 py-10 text-center text-muted-foreground">
            {t("noPages")}
          </div>
        </Container>
      </section>
    </div>
  );
}
