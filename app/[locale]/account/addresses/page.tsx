import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { AddressManager } from "@/components/account/AddressManager";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Addresses | Nichijo",
  description: "Manage your shipping addresses",
};

export default async function AddressesPage() {
  const t = await getTranslations("account");

  // If not logged in, redirect to Login Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }

  return (
    <AccountPageLayout
      title={t("myAddresses")}
      breadcrumbs={[{ label: t("myAccount"), href: "/account" }, { label: t("addresses") }]}
      maxWidth="lg"
    >
      <AddressManager />
    </AccountPageLayout>
  );
}
