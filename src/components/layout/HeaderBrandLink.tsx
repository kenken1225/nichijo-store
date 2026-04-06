"use client";

import Link from "next/link";
import { Image } from "@/components/shared/Image";
import { NavLinkPendingStyle } from "@/components/navigation/NavLinkPendingStyle";

export function HeaderBrandLink() {
  return (
    <Link href="/" className="inline-flex text-xl font-semibold tracking-tight text-foreground">
      <NavLinkPendingStyle className="inline-flex">
        <Image src="/logo-nichijo.png" alt="Nichijo Logo" width={90} height={90} preload sizes="90px" />
      </NavLinkPendingStyle>
    </Link>
  );
}
