import { NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/shopify/customer";
import { cookies } from "next/headers";

// Get order history
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;
    // const accessToken = "9c18efcfb35da854074eebfadb901234";

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    const orders = await getCustomerOrders(accessToken, 20);

    if (!orders) {
      return NextResponse.json({ orders: [] });
    }

    // Extract nodes from edges
    const orderList = orders.edges.map((edge) => edge.node);

    return NextResponse.json({
      orders: orderList,
      pageInfo: orders.pageInfo,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Error occurred while retrieving order history" }, { status: 500 });
  }
}
