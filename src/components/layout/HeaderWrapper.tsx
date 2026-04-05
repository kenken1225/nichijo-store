"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type HeaderWrapperProps = {
  children: React.ReactNode;
};

function isHomePathname(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/" || pathname === "/ar";
}

export function HeaderWrapper({ children }: HeaderWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = isHomePathname(pathname);

  useEffect(() => {
    if (!isHomePage) return;

    let rafId: number | null = null;
    let scrollListenerScheduled = false;

    const applyScrollState = () => {
      scrollListenerScheduled = false;
      const heroHeight = window.innerHeight;
      const nextScrolled = window.scrollY > heroHeight - 100;
      setIsScrolled(nextScrolled);
    };

    const onScroll = () => {
      if (scrollListenerScheduled) return;
      scrollListenerScheduled = true;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyScrollState();
      });
    };

    applyScrollState();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [isHomePage]);

  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isTransparent ? "bg-transparent border-transparent" : "bg-white/90 backdrop-blur border-b border-border"
        }`}
      >
        {children}
      </header>
      {!isHomePage && <div className="h-16" />}
    </>
  );
}
