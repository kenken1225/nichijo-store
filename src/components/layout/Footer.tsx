import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { getMenu, normalizeMenuUrl, isExternalUrl, type MenuItem } from "@/lib/shopify/navigation";
import { Image } from "@/components/shared/Image";
import { getTranslations } from "next-intl/server";
import { FooterBottom } from "./FooterBottom";

async function FooterCTA() {
  const t = await getTranslations("footer");
  return (
    <div className="text-center py-16 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">{t("ctaTitle")}</h2>
      <p className="text-sm md:text-base text-white/70 max-w-md mx-auto mb-6">
        {t("ctaDescription")}
      </p>
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
      >
        {t("browseCollections")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

type FooterLinksProps = {
  menuItems: MenuItem[];
};

function FooterLinks({ menuItems }: FooterLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 py-10 border-t border-white/10">
      {/* Logo column */}
      <div className="">
        <Link href="/">
          <Image src="/logo-nichijo-white.png" alt="Nichijo Logo" width={100} height={100} sizes="100px" loading="lazy" />
        </Link>
      </div>
      {/* Menu columns */}
      {menuItems.map((column) => (
        <div key={column.id} className="space-y-4">
          <h3 className="text-sm font-medium text-white">{column.title}</h3>
          {column.items && column.items.length > 0 && (
            <ul className="space-y-3 list-none">
              {column.items.map((link) => {
                const href = normalizeMenuUrl(link.url);
                const isExternal = isExternalUrl(link.url);

                return (
                  <li key={link.id}>
                    {isExternal ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                        {link.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export async function Footer({ locale }: { locale?: string }) {
  const menu = await getMenu("footer-main", locale);
  const menuItems = menu?.items ?? [];

  return (
    <footer style={{ backgroundColor: "var(--secondary-foreground)" }}>
      <Container>
        <FooterCTA />
        <FooterLinks menuItems={menuItems} />
        <FooterBottom />
      </Container>
    </footer>
  );
}
