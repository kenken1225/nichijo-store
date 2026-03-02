import { useState } from "react";
import Link from "next/link";
import { MenuItem, normalizeMenuUrl } from "@/lib/shopify/domain/navigation";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { DropdownItem } from "./DropdownItem";

// Desktop dropdown for items with children
export function DesktopDropdown({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const href = normalizeMenuUrl(item.url);

  if (!hasChildren) {
    return (
      <>
        <Link href={href} className="transition-colors hover:text-foreground">
          {item.title}
        </Link>
      </>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.title}
        <ChevronDown className={clsx("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full start-0 pt-2 z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[200px]">
            {item.items!.map((child) => (
              <DropdownItem key={child.id} item={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
