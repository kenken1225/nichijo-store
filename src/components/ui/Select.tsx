import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className, children, ...rest }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-foreground">
      {label ? <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span> : null}
      <select
        className={clsx(
          "rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/70",
          className
        )}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}



