import { NextRequest, NextResponse } from "next/server";
import { getCustomer, getCustomerInfo, updateCustomer } from "@/lib/shopify/domain/customer";
import { cookies } from "next/headers";

// Get customer information
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    // Specify the information to be obtained via query parameters
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    const customer = includeAll ? await getCustomer(accessToken) : await getCustomerInfo(accessToken);

    if (!customer) {
      cookieStore.delete("customerAccessToken");
      return NextResponse.json({ error: "Session is invalid. Please log in again" }, { status: 401 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json({ error: "Error occurred while retrieving customer information" }, { status: 500 });
  }
}

// Update customer information
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, acceptsMarketing } = body;

    const result = await updateCustomer(accessToken, {
      firstName,
      lastName,
      phone,
      acceptsMarketing,
    });

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ customer: result.customer });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json({ error: "Error occurred while updating customer information" }, { status: 500 });
  }
}
