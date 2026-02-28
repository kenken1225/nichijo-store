import { NextRequest, NextResponse } from "next/server";
import { recoverCustomerPassword } from "@/lib/shopify/domain/customer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await recoverCustomerPassword(email);

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email, you will receive an email with instructions to reset your password",
    });
  } catch (error) {
    console.error("Password recovery error:", error);
    return NextResponse.json({ error: "Password reset processing error" }, { status: 500 });
  }
}
