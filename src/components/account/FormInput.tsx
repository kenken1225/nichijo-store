"use client";

import { InputHTMLAttributes, useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  optional?: boolean;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ label, error, optional, type, className, ...props }, ref) {
    const t = useTranslations("auth");
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {optional && <span className="text-muted-foreground font-normal ms-1">{t("optional")}</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={clsx(
              "w-full px-4 py-3 rounded-lg border bg-input-background text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-colors",
              error && "border-destructive focus:ring-destructive/50 focus:border-destructive",
              isPassword && "pe-12",
              className
            )}
            {...props}
          />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});
