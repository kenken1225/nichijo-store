"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push("/account");
        router.refresh();
      } else {
        setError(result.error || t("loginFailed"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <FormInput
        label={t("emailAddress")}
        type="email"
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <FormInput
        label={t("password")}
        type="password"
        placeholder={t("passwordPlaceholder")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <div className="text-end">
        <Link
          href="/account/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <SubmitButton loading={loading}>{t("login")}</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/account/register" className="text-foreground font-medium hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
