import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
} from "@/lib/shopify/domain/customer";
import { cookies } from "next/headers";

// Get addresses
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    const result = await getCustomerAddresses(accessToken);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json({ error: "Error occurred while retrieving addresses" }, { status: 500 });
  }
}

// 住所追加
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Address information is required" }, { status: 400 });
    }

    const result = await createCustomerAddress(accessToken, address);

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ address: result.customerAddress });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json({ error: "Error occurred while adding address" }, { status: 500 });
  }
}

// Update address
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    const body = await request.json();
    const { id, address, setAsDefault } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Set as default address
    if (setAsDefault) {
      const defaultResult = await setDefaultCustomerAddress(accessToken, id);

      if (defaultResult.customerUserErrors.length > 0) {
        const errorMessage = defaultResult.customerUserErrors.map((e) => e.message).join(", ");
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }

      return NextResponse.json({ success: true, customer: defaultResult.customer });
    }

    // 住所情報更新
    if (!address) {
      return NextResponse.json({ error: "Address information is required" }, { status: 400 });
    }

    const result = await updateCustomerAddress(accessToken, id, address);

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ address: result.customerAddress });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ error: "Error occurred while updating address" }, { status: 500 });
  }
}

// Delete address
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("customerAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Login is required" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "住所IDが必要です" }, { status: 400 });
    }

    const result = await deleteCustomerAddress(accessToken, id);

    if (result.customerUserErrors.length > 0) {
      const errorMessage = result.customerUserErrors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      deletedId: result.deletedCustomerAddressId,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ error: "Error occurred while deleting address" }, { status: 500 });
  }
}
