import { Container } from "@/components/layout/Container";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionList } from "@/components/collections/CollectionList";
import { getCollections } from "@/lib/shopify/domain/collections";
import { getTranslations, getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

export default async function CollectionsPage() {
  const t = await getTranslations("collections");
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const collections = await getCollections(locale, countryCode);

  return (
    <div className="bg-background">
      <section className="bg-secondary/40 py-14">
        <Container className="space-y-4">
          <CollectionHeader
            title={t("title")}
            description={t("description")}
          />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <CollectionList collections={collections} />
        </Container>
      </section>
    </div>
  );
}
