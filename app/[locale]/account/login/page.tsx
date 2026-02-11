import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { LoginForm } from "@/components/account/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Login | Nichijo",
  description: "Log in to your Nichijo account",
};

export default async function LoginPage() {
  const t = await getTranslations("auth");

  // If already logged in, redirect to My Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (token) {
    redirect("/account");
  }

  return (
    <AccountPageLayout title={t("login")} breadcrumbs={[{ label: t("login") }]}>
      <LoginForm />
    </AccountPageLayout>
  );
}
