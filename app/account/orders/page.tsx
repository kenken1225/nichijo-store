import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { OrderHistory } from "@/components/account/OrderHistory";

export const metadata = {
  title: "Order History | Nichijo",
  description: "View your order history",
};

export default async function OrdersPage() {
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
