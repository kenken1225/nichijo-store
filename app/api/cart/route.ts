import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCart, addToCart, updateCartLine, removeFromCart, updateCartCountry, getCart } from "@/lib/shopify/domain/cart";
import { COUNTRY_COOKIE_KEY } from "@/lib/country-config";

function setCartCookie(res: NextResponse, cartId: string) {
  res.cookies.set("cartId", cartId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 6, // 6days
    secure: true,
  });
}

async function getCountryFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COUNTRY_COOKIE_KEY)?.value;
}

// Prioritize a cartId of Cookie, if not, use cartId of body.
async function getCartIdFromRequest(bodyCartId?: string | null): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value ?? bodyCartId ?? undefined;
}

async function syncCartCountry(cartId: string, countryCode?: string): Promise<void> {
  if (!countryCode) return;
  try {
    const cart = await getCart(cartId, countryCode);
    const cartCountry = cart?.buyerIdentity?.countryCode;
    if (cartCountry && cartCountry !== countryCode.toUpperCase()) {
      await updateCartCountry(cartId, countryCode);
    }
  } catch (error) {
    console.error("Error syncing cart country", error);
  }
}

export async function POST(req: Request) {
  const {
    cartId: bodyCartId,
    merchandiseId,
    quantity = 1,
  } = (await req.json()) as {
    cartId?: string;
    merchandiseId?: string;
    quantity?: number;
  };

  if (!merchandiseId) {
    return NextResponse.json({ error: "merchandiseId is required" }, { status: 400 });
  }

  try {
    const countryCode = await getCountryFromCookie();
    const cartId = await getCartIdFromRequest(bodyCartId);

    if (!cartId) {
      const { cart, cartId: newCartId } = await createCart(merchandiseId, quantity, countryCode);
      const res = NextResponse.json({ cartId: newCartId, cart });
      setCartCookie(res, newCartId);
      return res;
    }

    // if the cart's country is different from the cookie, sync the buyerIdentity first
    await syncCartCountry(cartId, countryCode);

    const { cart } = await addToCart(cartId, merchandiseId, quantity, countryCode);
    const res = NextResponse.json({ cartId, cart });
    setCartCookie(res, cartId);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Cart doesn't exist (expired) => delete cookie and make new cookie
    const hadCartId = await getCartIdFromRequest(bodyCartId);
    if (message.toLowerCase().includes("does not exist") && hadCartId) {
      try {
        const countryCode = await getCountryFromCookie();
        const { cart, cartId: newCartId } = await createCart(merchandiseId, quantity, countryCode);
        const res = NextResponse.json({ cartId: newCartId, cart });
        res.cookies.delete("cartId");
        setCartCookie(res, newCartId);
        return res;
      } catch {
        // Erro 500
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const {
    cartId: bodyCartId,
    lineId,
    quantity,
  } = (await req.json()) as {
    cartId?: string;
    lineId?: string;
    quantity?: number;
  };

  const cartId = await getCartIdFromRequest(bodyCartId);
  if (!cartId || !lineId || quantity === undefined) {
    return NextResponse.json(
      { error: "cartId (from cookie or body), lineId and quantity are required" },
      { status: 400 }
    );
  }

  try {
    const countryCode = await getCountryFromCookie();
    await syncCartCountry(cartId, countryCode);
    const { cart } = await updateCartLine(cartId, lineId, quantity, countryCode);
    const res = NextResponse.json({ cartId, cart });
    setCartCookie(res, cartId);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { cartId: bodyCartId, lineIds } = (await req.json()) as {
    cartId?: string;
    lineIds?: string[];
  };

  const cartId = await getCartIdFromRequest(bodyCartId);
  if (!cartId || !lineIds?.length) {
    return NextResponse.json({ error: "cartId (from cookie or body) and lineIds are required" }, { status: 400 });
  }

  try {
    const countryCode = await getCountryFromCookie();
    await syncCartCountry(cartId, countryCode);
    const { cart } = await removeFromCart(cartId, lineIds, countryCode);
    const res = NextResponse.json({ cartId, cart });
    setCartCookie(res, cartId);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
