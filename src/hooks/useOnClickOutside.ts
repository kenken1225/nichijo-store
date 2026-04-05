import { type RefObject, useEffect, useRef } from "react";

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  enabled: boolean
): void {
  const onOutsideRef = useRef(onOutside);
  useEffect(() => {
    onOutsideRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const target = e.target;
      if (target instanceof Node && !el.contains(target)) {
        onOutsideRef.current();
      }
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, enabled]);
}
