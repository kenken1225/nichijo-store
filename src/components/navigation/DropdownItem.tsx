import { useState } from "react";
import Link from "next/link";
import { MenuItem, normalizeMenuUrl } from "@/lib/shopify/domain/navigation";
import { ChevronRight } from "lucide-react";

// Recursive dropdown item for nested menus
export function DropdownItem({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const href = normalizeMenuUrl(item.url);

  if (!hasChildren) {
    return (
      <Link
        href={href}
        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        {item.title}
        <ChevronRight className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute start-full top-0 ms-1 z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
            {item.items!.map((grandchild) => (
              <Link
                key={grandchild.id}
                href={normalizeMenuUrl(grandchild.url)}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {grandchild.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
