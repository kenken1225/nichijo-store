import { AccountPageLayout } from "@/components/account/AccountPageLayout";
import { ProfileForm } from "@/components/account/ProfileForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Profile | Nichijo",
  description: "Edit your profile information",
};

export default async function ProfilePage() {
  const t = await getTranslations("account");

  // If not logged in, redirect to Login Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }

  return (
    <AccountPageLayout title={t("myProfile")} breadcrumbs={[{ label: t("myAccount"), href: "/account" }, { label: t("profile") }]}>
      <ProfileForm />
    </AccountPageLayout>
  );
}
