"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function SearchForm() {
  const t = useTranslations("search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentQuery = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(currentQuery);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateURL = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  // Handle input change - set searching state here (outside useEffect)
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value !== currentQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  // Debounce URL update
  useEffect(() => {
    if (inputValue === currentQuery) {
      return;
    }

    timerRef.current = setTimeout(() => {
      updateURL(inputValue);
      setIsSearching(false);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue, currentQuery, updateURL]);

  const handleClear = () => {
    setInputValue("");
    setIsSearching(false);
    updateURL("");
  };

  return (
    <div className="relative">
      <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full ps-12 pe-12 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
      />
      <div className="absolute end-4 top-1/2 -translate-y-1/2">
        {isSearching ? (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        ) : inputValue ? (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label={t("clear")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
