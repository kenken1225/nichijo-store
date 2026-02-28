import Link from "next/link";
import { Container } from "./Container";
import { HeaderWrapper } from "./HeaderWrapper";
import { Navigation } from "../navigation";

import { Image } from "@/components/shared/Image";
import { getMenu } from "@/lib/shopify/domain/navigation";

export async function Header({ locale }: { locale?: string }) {
  const menu = await getMenu("header-main", locale);
  const menuItems = menu?.items ?? [];

  return (
    <HeaderWrapper>
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
          <Image src="/logo-nichijo.png" alt="Nichijo Logo" width={90} height={90} preload sizes="90px" />
        </Link>
        <Navigation menuItems={menuItems} />
      </Container>
    </HeaderWrapper>
  );
}
