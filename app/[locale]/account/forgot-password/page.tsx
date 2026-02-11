import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { ForgotPasswordForm } from "@/components/account/ForgotPasswordForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Reset Password | Nichijo",
  description: "Reset your Nichijo account password",
};

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  // If already logged in, redirect to My Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (token) {
    redirect("/account");
  }

  return (
    <AccountPageLayout
      title={t("resetTitle")}
      description={t("resetDescription")}
      breadcrumbs={[{ label: t("login"), href: "/account/login" }, { label: t("resetPassword") }]}
    >
      <ForgotPasswordForm />
    </AccountPageLayout>
  );
}
