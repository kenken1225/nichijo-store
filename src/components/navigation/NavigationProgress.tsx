"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationProgressTrack() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const el = (e.target as HTMLElement | null)?.closest?.("a");
      if (!el || !(el instanceof HTMLAnchorElement)) return;
      if (el.download) return;
      const attrHref = el.getAttribute("href");
      if (!attrHref || attrHref.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(el.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      if (el.target === "_blank") return;
      const next = `${url.pathname}${url.search}`;
      const cur = `${window.location.pathname}${window.location.search}`;
      if (next === cur) return;
      setActive(true);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed start-0 top-0 z-[100] h-0.5 w-full overflow-hidden bg-primary/15"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading page"
    >
      <div className="nav-progress-indeterminate h-full w-1/3 bg-primary" />
    </div>
  );
}

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  return <NavigationProgressTrack key={routeKey} />;
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
