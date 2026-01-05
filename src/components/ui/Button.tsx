import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { clsx } from "clsx";

type Variant = "default" | "ghost";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
  }
>;

export function Button({ children, className, variant = "default", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  const styles =
    variant === "ghost"
      ? "text-foreground hover:bg-muted/60"
      : "bg-primary text-primary-foreground hover:opacity-90 px-4 py-2";

  return (
    <button className={clsx(base, styles, className)} {...props}>
      {children}
    </button>
  );
}



