"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export function BackLink({ fallbackHref = "/", label = "Back", className }: BackLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
