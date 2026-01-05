"use client";

import { useEffect, useRef, useState } from "react";

export type SortValue = "featured" | "price-asc" | "price-desc" | "newest";

type SortSelectProps = {
  value: SortValue;
  onChange: (next: SortValue) => void;
};

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLabel = OPTIONS.find((o) => o.value === value)?.label ?? "Featured";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:border-foreground/60"
      >
        <span>{currentLabel}</span>
        <span className="text-muted-foreground">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-52 rounded-md border border-border bg-card shadow-lg">
          <div className="py-1 text-sm text-foreground">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-left hover:bg-muted/60 ${
                  opt.value === value ? "text-primary font-semibold" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
