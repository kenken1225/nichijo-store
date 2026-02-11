"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type HeaderWrapperProps = {
  children: React.ReactNode;
};

export function HeaderWrapper({ children }: HeaderWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight - 100);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
