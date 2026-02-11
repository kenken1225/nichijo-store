"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type SearchPaginationProps = {
  currentPage: number;
  totalPages: number;
  paramName: string;
};

export function SearchPagination({ currentPage, totalPages, paramName }: SearchPaginationProps) {
  const t = useTranslations("search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete(paramName);
    } else {
      params.set(paramName, page.toString());
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => updatePage(i)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t("prevPage")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => updatePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t("nextPage")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
