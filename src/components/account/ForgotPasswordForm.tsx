"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { useTranslations } from "next-intl";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/account/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("failedResetSend"));
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Password recovery error:", err);
      setError(t("resetSendError"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
          {t("resetSentMessage", { email })}
        </div>
        <p className="text-sm text-muted-foreground">
          {t("checkInbox")}
        </p>
        <Link
          href="/account/login"
          className="inline-flex items-center gap-2 text-sm text-foreground font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <FormInput
        label={t("emailAddress")}
        type="email"
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <SubmitButton loading={loading}>{t("sendResetLink")}</SubmitButton>

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
