import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Create New Password | Nichijo",
  description: "Create a new password for your Nichijo account",
};

type PageProps = {
  searchParams: Promise<{
    reset_url?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const t = await getTranslations("auth");
  const { reset_url } = await searchParams;

  if (!reset_url) {
    redirect("/account/login");
  }

  return (
    <AccountPageLayout
      title={t("createNewPassword")}
      description={t("newPasswordDesc")}
      breadcrumbs={[{ label: t("login"), href: "/account/login" }, { label: t("createNewPassword") }]}
    >
      <ResetPasswordForm resetUrl={reset_url} />
    </AccountPageLayout>
  );
}
