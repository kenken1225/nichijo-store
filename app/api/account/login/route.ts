import { NextRequest, NextResponse } from "next/server";
import { loginCustomer } from "@/lib/shopify/domain/customer";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await loginCustomer(email, password);

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (!result.customerAccessToken) {
      return NextResponse.json({ error: "Login failed" }, { status: 400 });
    }

    // Save access token to cookie
    const cookieStore = await cookies();
    const expiresAt = new Date(result.customerAccessToken.expiresAt);

    cookieStore.set("customerAccessToken", result.customerAccessToken.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      expiresAt: result.customerAccessToken.expiresAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login processing error" }, { status: 500 });
  }
}
