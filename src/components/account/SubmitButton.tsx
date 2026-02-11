"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function SubmitButton({ children, loading, disabled, className, ...props }: SubmitButtonProps) {
  const t = useTranslations("auth");
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={clsx(
        "w-full py-3 px-4 rounded-lg font-medium text-sm",
        "bg-primary",
        "hover:opacity-90 transition-opacity",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{t("loading")}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
