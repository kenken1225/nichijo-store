"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { MobileDrawer } from "./MobileDrawer";
import { MenuItem } from "@/lib/shopify/navigation";
import { DesktopDropdown } from "./DesktopDropdown";

type NavigationProps = {
  className?: string;
  menuItems: MenuItem[];
};

const iconLinks = [
  { href: "/pages/search", label: "Search", icon: Search },
  { href: "/account", label: "Account", icon: User },
];

export function Navigation({ className, menuItems }: NavigationProps) {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={clsx("hidden md:flex items-center gap-6 text-sm text-muted-foreground", className)}>
        {menuItems.map((item) => (
          <DesktopDropdown key={item.id} item={item} />
        ))}
        <div className="flex items-center gap-4">
          {iconLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
              aria-label={link.label}
            >
              <link.icon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          ))}
          <Link href="/cart" className="relative transition-colors hover:text-foreground" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={clsx("flex md:hidden items-center gap-3", className)}>
        {iconLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-foreground"
            aria-label={link.label}
          >
            <link.icon className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        ))}
        <Link href="/cart" className="relative transition-colors hover:text-foreground" aria-label="Cart">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="text-foreground p-1"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} menuItems={menuItems} />
    </>
  );
}
