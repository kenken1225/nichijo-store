import { ReactNode } from "react";
import { AccountBreadcrumb } from "./AccountBreadcrumb";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AccountPageLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  maxWidth?: "sm" | "md" | "lg";
};

export function AccountPageLayout({
  children,
  title,
  description,
  breadcrumbs,
  maxWidth = "sm",
}: AccountPageLayoutProps) {
  const maxWidthClass = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
  }[maxWidth];

  return (
    <div className="bg-background min-h-[80vh] py-12">
      <div className="container mx-auto px-4">
        <AccountBreadcrumb items={breadcrumbs} />

        <div className={`${maxWidthClass} mx-auto`}>
          <h1 className="text-2xl font-semibold text-center mb-2">{title}</h1>
          {description && <p className="text-muted-foreground text-center text-sm mb-6">{description}</p>}
          <div className="border-t border-border mt-4 pt-8 ">{children}</div>
        </div>
      </div>
    </div>
  );
}
