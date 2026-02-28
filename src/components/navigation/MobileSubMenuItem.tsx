import { useState } from "react";
import Link from "next/link";
import { MenuItem, normalizeMenuUrl } from "@/lib/shopify/domain/navigation";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

// Mobile sub-menu item (for children and grandchildren)
export function MobileSubMenuItem({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const href = normalizeMenuUrl(item.url);

  if (!hasChildren) {
    return (
      <Link
        href={href}
        onClick={onClose}
        className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-sm text-muted-foreground"
      >
        {item.title}
        <ChevronDown className={clsx("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="ps-4">
          {item.items!.map((grandchild) => (
            <Link
              key={grandchild.id}
              href={normalizeMenuUrl(grandchild.url)}
              onClick={onClose}
              className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {grandchild.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
