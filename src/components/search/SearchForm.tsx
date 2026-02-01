"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

export function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentQuery = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(currentQuery);
  const [isSearching, setIsSearching] = useState(false);

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

  useEffect(() => {
    if (inputValue === currentQuery) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      updateURL(inputValue);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, currentQuery, updateURL]);

  const handleClear = () => {
    setInputValue("");
    updateURL("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search products and articles..."
        className="w-full pl-12 pr-12 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {isSearching ? (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        ) : inputValue ? (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
