import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { OrderHistory } from "@/components/account/OrderHistory";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Order History | Nichijo",
  description: "View your order history",
};

export default async function OrdersPage() {
  const t = await getTranslations("account");

  return (
    <AccountPageLayout
      title={t("orderHistory")}
      breadcrumbs={[{ label: t("myAccount"), href: "/account" }, { label: t("orders") }]}
      maxWidth="lg"
    >
      <OrderHistory />
    </AccountPageLayout>
  );
}
