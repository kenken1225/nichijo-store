import { getPageSingle } from "@/lib/shopify/domain/pages";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { getCountryCode } from "@/lib/country-config";

// Revalidate
export const revalidate = 3600;

type GetPageProps = {
  params: Promise<{ handle: string }>;
};

export default async function GetPage({ params }: GetPageProps) {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const countryCode = await getCountryCode();
  const { handle } = await params;
  if (!handle) {
    return notFound();
  }
  const data = await getPageSingle(handle, locale, countryCode);

  return (
    <div className="bg-background">
      <section className="py-8 sm:py-12">
        <Container className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              {t("home")}
            </Link>{" "}
            /{" "}
            <Link href={`/pages/${data?.handle}`} className="hover:underline">
              {data?.title}
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-12 ">
        <Container className="max-w-4xl space-y-6">
          <h2 className="text-3xl font-bold text-foreground leading-tight sm:text-4xl">{data?.title}</h2>
          <div
            className="page-common-container space-y-6 prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-lg prose-blockquote:border-s-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/60 prose-blockquote:px-4 prose-blockquote:py-3"
            dangerouslySetInnerHTML={{ __html: data?.body ?? notFound() }}
          />
        </Container>
      </section>
    </div>
  );
}
