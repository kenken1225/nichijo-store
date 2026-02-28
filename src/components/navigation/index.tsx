"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useTranslations } from "next-intl";
import { MobileDrawer } from "./MobileDrawer";
import { MenuItem } from "@/lib/shopify/domain/navigation";
import { DesktopDropdown } from "./DesktopDropdown";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileLocaleSwitcher } from "./MobileLocaleSwitcher";

type NavigationProps = {
  className?: string;
  menuItems: MenuItem[];
};

export function Navigation({ className, menuItems }: NavigationProps) {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations("common");

  const closeDrawer = () => setDrawerOpen(false);

  const iconLinks = [
    { href: "/pages/search", label: t("search"), icon: Search },
    { href: "/account", label: t("account"), icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={clsx("hidden md:flex items-center gap-6 text-sm text-muted-foreground", className)}>
        {menuItems.map((item) => (
          <DesktopDropdown key={item.id} item={item} />
        ))}
        <div className="flex items-center gap-4">
          <LocaleSwitcher variant="header" />
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
          <Link href="/cart" className="relative transition-colors hover:text-foreground" aria-label={t("cart")}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -bottom-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={clsx("flex md:hidden items-center gap-3", className)}>
        <MobileLocaleSwitcher />
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
        <Link href="/cart" className="relative transition-colors hover:text-foreground" aria-label={t("cart")}>
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute -bottom-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="text-foreground p-1"
          aria-label={t("openMenu")}
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} menuItems={menuItems} />
    </>
  );
}
