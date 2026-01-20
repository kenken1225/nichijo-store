import { Container } from "@/components/layout/Container";
import { YouMayAlsoLike } from "@/components/products/YouMayAlsoLike";
import { getProductByHandle, getProductRecommendations } from "@/lib/shopify/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CartContent } from "@/components/cart/CartContent";
import { getCart } from "@/lib/shopify/cart";
import { cookies } from "next/headers";

export const revalidate = 3600;

export default async function CartPage() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  const initialCart = cartId ? await getCart(cartId) : null;

  return (
    <div className="bg-background">
      <section className="border-b border-border">
        <Container className="py-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / Cart``
        </Container>
      </section>

      <section className="py-10">
        <Container className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Your Cart</h1>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <Suspense fallback={<div> Loading...</div>}>
            <CartContent cartId={cartId ?? null} initialCart={initialCart} />
          </Suspense>
        </Container>
      </section>

      {/* <YouMayAlsoLike
        items={recommendations.length ? recommendations : undefined}
        useRecentLocalStorage
        showAddButton
        variant="default"
        title="You May Also Like"
      /> */}
    </div>
  );
}
