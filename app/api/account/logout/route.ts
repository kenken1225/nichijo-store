import { NextResponse } from "next/server";
import { logoutCustomer } from "@/lib/shopify/domain/customer";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (accessToken) {
      try {
        await logoutCustomer(accessToken);
      } catch (error) {
        console.error("Shopify logout error:", error);
      }
    }

    // Cookieを削除
    cookieStore.delete("customerAccessToken");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout processing error" }, { status: 500 });
  }
}
