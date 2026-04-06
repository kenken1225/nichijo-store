"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem } from "@/lib/shopify/domain/navigation";
import { MobileDrawer } from "./MobileDrawer";
import { NavLinkPendingStyle } from "./NavLinkPendingStyle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileLocaleSwitcher } from "./MobileLocaleSwitcher";

export type NavigationLabels = {
  search: string;
  account: string;
  cart: string;
  openMenu: string;
};

export function NavigationDesktopTray({ labels }: { labels: NavigationLabels }) {
  const { itemCount } = useCart();
  const iconLinks = [
    { href: "/pages/search", label: labels.search, icon: Search },
    { href: "/account", label: labels.account, icon: User },
  ];

  return (
    <div className="flex items-center gap-4">
      <LocaleSwitcher variant="header" />
      {iconLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition-colors hover:text-foreground"
          aria-label={link.label}
        >
          <NavLinkPendingStyle className="inline-flex">
            <link.icon className="h-5 w-5" strokeWidth={1.5} />
          </NavLinkPendingStyle>
        </Link>
      ))}
      <Link href="/cart" className="relative transition-colors hover:text-foreground" aria-label={labels.cart}>
        <NavLinkPendingStyle className="inline-flex relative">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute -bottom-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </NavLinkPendingStyle>
      </Link>
    </div>
  );
}

export function NavigationMobileChrome({
  menuItems,
  labels,
  className,
}: {
  menuItems: MenuItem[];
  labels: NavigationLabels;
  className?: string;
}) {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  const iconLinks = [
    { href: "/pages/search", label: labels.search, icon: Search },
    { href: "/account", label: labels.account, icon: User },
  ];

  return (
    <>
      <div className={clsx("flex md:hidden items-center gap-3", className)}>
        <MobileLocaleSwitcher />
        {iconLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-foreground"
            aria-label={link.label}
          >
            <NavLinkPendingStyle className="inline-flex">
              <link.icon className="h-5 w-5" strokeWidth={1.5} />
            </NavLinkPendingStyle>
          </Link>
        ))}
        <Link href="/cart" className="relative transition-colors hover:text-foreground" aria-label={labels.cart}>
          <NavLinkPendingStyle className="inline-flex relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -bottom-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </NavLinkPendingStyle>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="text-foreground p-1"
          aria-label={labels.openMenu}
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} menuItems={menuItems} />
    </>
  );
}
