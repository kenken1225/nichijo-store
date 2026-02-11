"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { useTranslations } from "next-intl";

type ResetPasswordFormProps = {
  resetUrl: string;
};

export function ResetPasswordForm({ resetUrl }: ResetPasswordFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 8) {
      setError(t("passwordMinError"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsNoMatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/account/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetUrl,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("failedReset"));
        return;
      }

      setSuccess(true);

      // After 3 seconds, redirect to My Page
      setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(t("resetError"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
          {t("passwordResetSuccess")}
        </div>
        <p className="text-sm text-muted-foreground">{t("redirectMessage")}</p>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-foreground font-medium hover:underline"
        >
          {t("goToAccount")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <div className="space-y-2">
        <FormInput
          label={t("newPassword")}
          type="password"
          placeholder={t("newPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">{t("passwordMinLength")}</p>
      </div>

      <FormInput
        label={t("confirmPassword")}
        type="password"
        placeholder={t("confirmPasswordPlaceholder")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
        minLength={8}
      />

      <SubmitButton loading={loading}>{t("resetPassword")}</SubmitButton>

      <div className="text-center">
        <Link
          href="/account/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToLogin")}
        </Link>
      </div>
    </form>
  );
}
