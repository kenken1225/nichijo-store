import clsx from "clsx";
import type { MenuItem } from "@/lib/shopify/domain/navigation";
import { DesktopDropdown } from "./DesktopDropdown";
import { NavigationDesktopTray, NavigationMobileChrome, type NavigationLabels } from "./NavigationIslands";

export type { NavigationLabels };

type NavigationProps = {
  className?: string;
  menuItems: MenuItem[];
  labels: NavigationLabels;
};

export function Navigation({ className, menuItems, labels }: NavigationProps) {
  return (
    <>
      <nav className={clsx("hidden md:flex items-center gap-6 text-sm text-muted-foreground", className)}>
        {menuItems.map((item) => (
          <DesktopDropdown key={item.id} item={item} />
        ))}
        <NavigationDesktopTray labels={labels} />
      </nav>

      <NavigationMobileChrome menuItems={menuItems} labels={labels} className={className} />
    </>
  );
}
