import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { RegisterForm } from "@/components/account/RegisterForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Create Account | Nichijo",
  description: "Create your Nichijo account",
};

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  // If already logged in, redirect to My Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (token) {
    redirect("/account");
  }

  return (
    <AccountPageLayout title={t("createAccount")} breadcrumbs={[{ label: t("register") }]}>
      <RegisterForm />
    </AccountPageLayout>
  );
}
