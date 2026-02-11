import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "My Account | Nichijo",
  description: "Manage your Nichijo account",
};

export default async function AccountPage() {
  const t = await getTranslations("account");

  // If not logged in, redirect to Login Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }

  return (
    <AccountPageLayout title={t("myAccount")} breadcrumbs={[{ label: t("myAccount") }]} maxWidth="md">
      <AccountDashboard />
    </AccountPageLayout>
  );
}
