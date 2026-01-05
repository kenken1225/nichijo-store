import type { ComponentType } from "react";
import clsx from "clsx";

type IconProps = {
  icon: ComponentType<{ className?: string }>;
  className?: string;
};

export function Icon({ icon: IconComponent, className }: IconProps) {
  return <IconComponent className={clsx("h-5 w-5", className)} />;
}

