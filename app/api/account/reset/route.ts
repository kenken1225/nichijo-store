import { NextRequest, NextResponse } from "next/server";
import { resetCustomerPassword, resetCustomerPasswordByUrl } from "@/lib/shopify/domain/customer";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, resetToken, resetUrl, password } = body;

    if (!password) {
      return NextResponse.json({ error: "New password is required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    let result;

    if (resetUrl) {
      result = await resetCustomerPasswordByUrl(resetUrl, password);
    } else if (customerId && resetToken) {
      result = await resetCustomerPassword(customerId, resetToken, password);
    } else {
      return NextResponse.json({ error: "Reset information is missing" }, { status: 400 });
    }

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // After successful reset, auto-login
    if (result.customerAccessToken) {
      const cookieStore = await cookies();
      const expiresAt = new Date(result.customerAccessToken.expiresAt);

      cookieStore.set("customerAccessToken", result.customerAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Password reset processing error" }, { status: 500 });
  }
}
