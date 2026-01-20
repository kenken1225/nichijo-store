import { Container } from "@/components/layout/Container";
import { redirect } from "next/navigation";
import { getPageList } from "@/lib/shopify/pages";

// Revalidate
export const revalidate = 3600;

export default async function PagesPage() {
  const pages = await getPageList();
  const getPagesToAbout = pages.find((page) => page.handle.toLowerCase() === "about");
  if (getPagesToAbout) {
    redirect(`/pages/${getPagesToAbout.handle}`);
  }

  return (
    <div className="bg-background">
      <section className="py-12">
        <Container>
          <div className="rounded-lg border border-border bg-card px-4 py-10 text-center text-muted-foreground">
            There are no Pages yet. Please prepare Pages on the Shopify side and then check again.
          </div>
        </Container>
      </section>
    </div>
  );
}
