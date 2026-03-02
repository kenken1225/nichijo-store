"use client";

import { useTransition, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, X, Check, Loader2 } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import { SUPPORTED_COUNTRIES, type CountryConfig } from "@/lib/country-config";

const LANGUAGES = [
  { code: "en", label: "English", labelAr: "الإنجليزية" },
  { code: "ar", label: "العربية", labelAr: "العربية" },
];

export function MobileLocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { country, setCountry } = useCountry();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      startTransition(() => {
        const segments = pathname.split("/");
        if (segments[1] === "en" || segments[1] === "ar") {
          segments[1] = newLocale;
        } else {
          segments.splice(1, 0, newLocale);
        }
        const newPath = segments.join("/") || "/";
        router.replace(newPath);
      });
    },
    [pathname, router, startTransition]
  );

  const handleCountryChange = useCallback(
    (countryConfig: CountryConfig) => {
      setCountry(countryConfig.code);
      setIsOpen(false);
    },
    [setCountry]
  );

  const currentLanguage = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center transition-colors hover:text-foreground"
        aria-label={t("selectLanguage")}
        disabled={isPending}
      >
        <Globe className="h-5 w-5" strokeWidth={1.5} />
        <span className="absolute -bottom-1 -end-1 text-[10px] leading-none">{country.flag}</span>
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* inline keyframe definitions */}
            <style>{`
              @keyframes mls-fade-in { from { opacity: 0; } to { opacity: 1; } }
              @keyframes mls-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>

            {/* overlay */}
            <div
              className="fixed inset-0 z-[9999] bg-black/40"
              style={{ animation: "mls-fade-in 200ms ease-out" }}
              onClick={() => setIsOpen(false)}
            />

            {/* slide up panel */}
            <div className="fixed inset-x-0 bottom-0 z-[9999]" style={{ animation: "mls-slide-up 300ms ease-out" }}>
              <div className="rounded-t-2xl bg-white shadow-2xl max-h-[85vh] flex flex-col">
                {/* header - shrink しない固定ヘッダー */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                  <h2 className="text-base font-semibold text-foreground">{t("panelTitle")}</h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={t("close")}
                  >
                    <X className="h-5 w-5 text-foreground/60" />
                  </button>
                </div>

                <div
                  className="overflow-y-auto flex-1 min-h-0 overscroll-contain px-5 py-4 space-y-6"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {/* language section */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium mb-3">
                      {t("languageLabel")}
                    </p>
                    <div className="flex gap-2">
                      {LANGUAGES.map((lang) => {
                        const isActive = lang.code === locale;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            disabled={isPending}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                              isActive
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-gray-200 bg-white text-foreground/70 hover:border-foreground/30"
                            } ${isPending ? "opacity-60" : ""}`}
                          >
                            {isPending && isActive ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              isActive && <Check className="h-4 w-4" />
                            )}
                            <span>{lang.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* currency / country section */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium mb-3">
                      {t("countryLabel")}
                    </p>
                    <div className="space-y-1">
                      {SUPPORTED_COUNTRIES.map((c) => {
                        const isActive = c.code === country.code;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleCountryChange(c)}
                            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                              isActive
                                ? "bg-primary/5 border border-primary"
                                : "bg-gray-50 border border-transparent hover:bg-gray-100"
                            }`}
                          >
                            <span className="text-lg">{c.flag}</span>
                            <span
                              className={`flex-1 text-start ${
                                isActive ? "font-medium text-primary" : "text-foreground/80"
                              }`}
                            >
                              {locale === "ar" ? c.nameAr : c.nameEn}
                            </span>
                            <span className={`text-xs ${isActive ? "text-primary/70" : "text-foreground/40"}`}>
                              {c.currency}
                            </span>
                            {isActive && <Check className="h-4 w-4 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* bottom current selection display */}
                <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground shrink-0">
                  <span>{currentLanguage.label}</span>
                  <span className="text-foreground/20">•</span>
                  <span>
                    {country.flag} {country.currency}
                  </span>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
