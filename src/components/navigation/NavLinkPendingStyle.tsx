"use client";

import { useLinkStatus } from "next/link";
import clsx from "clsx";

type NavLinkPendingStyleProps = {
  children: React.ReactNode;
  className?: string;
};

export function NavLinkPendingStyle({ children, className }: NavLinkPendingStyleProps) {
  const { pending } = useLinkStatus();
  return (
    <span className={clsx("transition-opacity duration-200", className, pending && "opacity-50")}>{children}</span>
  );
}
