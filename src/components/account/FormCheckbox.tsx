"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type FormCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  error?: string;
};

export function FormCheckbox({
  label,
  error,
  className,
  ...props
}: FormCheckboxProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={clsx(
            "mt-1 h-4 w-4 rounded border-border text-primary",
            "focus:ring-2 focus:ring-primary/50",
            className
          )}
          {...props}
        />
        <span className="text-sm text-foreground">{label}</span>
      </label>
      {error && <p className="text-sm text-destructive ms-7">{error}</p>}
    </div>
  );
}
