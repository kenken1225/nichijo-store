"use client";

import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";

export function FooterBottom() {
  const t = useTranslations("footer");
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-white/10 text-xs text-white/50">
      <span>{t("rights", { year: new Date().getFullYear() })}</span>
      <LocaleSwitcher variant="footer" />
    </div>
  );
}
