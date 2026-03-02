import { NextRequest, NextResponse } from "next/server";
import { createCustomer, loginCustomer } from "@/lib/shopify/domain/customer";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, acceptsMarketing } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Password length check (Shopify requires at least 8 characters)
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Register customer
    const result = await createCustomer({
      email,
      password,
      firstName,
      lastName,
      phone,
      acceptsMarketing: acceptsMarketing ?? false,
    });

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (!result.customer) {
      return NextResponse.json({ error: "Account creation failed" }, { status: 400 });
    }

    // After registration, auto-login
    const loginResult = await loginCustomer(email, password);

    if (loginResult.customerAccessToken) {
      const cookieStore = await cookies();
      const expiresAt = new Date(loginResult.customerAccessToken.expiresAt);

      cookieStore.set("customerAccessToken", loginResult.customerAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
      });
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: result.customer.id,
        email: result.customer.email,
        firstName: result.customer.firstName,
        lastName: result.customer.lastName,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Account creation processing error" }, { status: 500 });
  }
}
