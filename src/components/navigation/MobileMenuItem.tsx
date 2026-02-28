import { useState } from "react";
import Link from "next/link";
import { MenuItem, normalizeMenuUrl } from "@/lib/shopify/domain/navigation";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { MobileSubMenuItem } from "./MobileSubMenuItem";

// Mobile accordion item
export function MobileMenuItem({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const href = normalizeMenuUrl(item.url);

  if (!hasChildren) {
    return (
      <Link
        href={href}
        onClick={onClose}
        className="block py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border"
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-base font-medium text-foreground"
      >
        {item.title}
        <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="ps-4 pb-2">
          {item.items!.map((child) => (
            <MobileSubMenuItem key={child.id} item={child} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}
