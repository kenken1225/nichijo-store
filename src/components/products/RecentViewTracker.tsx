"use client";

import { useEffect } from "react";

type RecentViewTrackerProps = {
  handle: string;
  maxItems?: number;
};

export function RecentViewTracker({ handle, maxItems = 10 }: RecentViewTrackerProps) {
  useEffect(() => {
    if (!handle) return;
    if (typeof window === "undefined") return;
    const key = "recentProducts";
    const existing = (() => {
      try {
        return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
      } catch {
        return [];
      }
    })();
    const next = [handle, ...existing.filter((h) => h !== handle)].slice(0, maxItems);
    window.localStorage.setItem(key, JSON.stringify(next));
  }, [handle, maxItems]);

  return null;
}
