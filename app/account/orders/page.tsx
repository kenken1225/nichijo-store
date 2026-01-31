import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { OrderHistory } from "@/components/account/OrderHistory";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Order History | Nichijo",
  description: "View your order history",
};

export default async function OrdersPage() {
  // If not logged in, redirect to Login Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  // if (!token) {
  //   redirect("/account/login");
  // }

  return (
    <AccountPageLayout
      title="Order History"
      breadcrumbs={[{ label: "Account", href: "/account" }, { label: "Orders" }]}
      maxWidth="lg"
    >
      <OrderHistory />
    </AccountPageLayout>
  );
}
