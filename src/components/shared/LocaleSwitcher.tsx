"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, ChevronDown, Loader2 } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import { SUPPORTED_COUNTRIES, type CountryConfig } from "@/lib/country-config";

type LocaleSwitcherProps = {
  variant?: "header" | "footer";
};

const LANGUAGES = [
  { code: "en", label: "English", labelAr: "الإنجليزية" },
  { code: "ar", label: "العربية", labelAr: "العربية" },
];

export function LocaleSwitcher({ variant = "footer" }: LocaleSwitcherProps) {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { country, setCountry } = useCountry();

  const [openDropdown, setOpenDropdown] = useState<"language" | "country" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // outside click to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setOpenDropdown(null);
    startTransition(() => {
      // remove the locale prefix from the current path and switch to the new locale
      const segments = pathname.split("/");
      // check if the first segment of the path is the locale code
      if (segments[1] === "en" || segments[1] === "ar") {
        segments[1] = newLocale;
      } else {
        segments.splice(1, 0, newLocale);
      }
      const newPath = segments.join("/") || "/";
      router.replace(newPath);
    });
  };

  const handleCountryChange = (countryConfig: CountryConfig) => {
    setOpenDropdown(null);
    setCountry(countryConfig.code);
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  // style based on the variant
  const isFooter = variant === "footer";
  const buttonBaseClass = `flex items-center gap-2 text-sm transition-colors rounded-md px-3 py-2 ${
    isFooter
      ? "text-white/60 hover:text-white hover:bg-white/10"
      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
  }`;
  const dropdownClass = `absolute z-50 min-w-[200px] rounded-lg border shadow-lg py-1 right-0 ${
    isFooter ? "bg-zinc-800 border-white/10" : "bg-white border-gray-200"
  }`;
  const itemClass = `w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
    isFooter
      ? "text-white/70 hover:text-white hover:bg-white/10"
      : "text-foreground/70 hover:text-foreground hover:bg-gray-50"
  }`;
  const activeItemClass = `w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 font-medium ${
    isFooter ? "text-white bg-white/5" : "text-foreground bg-gray-50"
  }`;

  return (
    <div ref={dropdownRef} className="flex items-center gap-2 relative">
      {/* language change button */}
      <div className="relative">
        <button
          type="button"
          className={buttonBaseClass}
          onClick={() => setOpenDropdown(openDropdown === "language" ? null : "language")}
          aria-label={t("selectLanguage")}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span>{currentLanguage.label}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === "language" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "language" && (
          <div className={`${dropdownClass} ${isFooter ? "bottom-full mb-1" : "top-full mt-1"}`}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={lang.code === locale ? activeItemClass : itemClass}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* separator */}
      <span className={isFooter ? "text-white/20" : "text-foreground/20"}>|</span>

      {/* country / currency change button */}
      <div className="relative">
        <button
          type="button"
          className={buttonBaseClass}
          onClick={() => setOpenDropdown(openDropdown === "country" ? null : "country")}
          aria-label={t("selectCountry")}
        >
          <span>{country.flag}</span>
          <span>{country.currency}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === "country" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "country" && (
          <div
            className={`${dropdownClass} ${
              isFooter ? "bottom-full mb-1" : "top-full mt-1"
            } max-h-[300px] overflow-y-auto`}
          >
            {SUPPORTED_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className={c.code === country.code ? activeItemClass : itemClass}
                onClick={() => handleCountryChange(c)}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1">{locale === "ar" ? c.nameAr : c.nameEn}</span>
                <span className={isFooter ? "text-white/40 text-xs" : "text-foreground/40 text-xs"}>{c.currency}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
