"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormInput } from "./FormInput";
import { FormCheckbox } from "./FormCheckbox";
import { SubmitButton } from "./SubmitButton";
import { useTranslations } from "next-intl";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    acceptsMarketing: false,
    acceptsPrivacyPolicy: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.acceptsPrivacyPolicy) {
      setError(t("policyRequired"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("passwordMinError"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          acceptsMarketing: formData.acceptsMarketing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("registrationFailed"));
        return;
      }

      // After successful registration, redirect to My Page
      router.push("/account");
      router.refresh();
    } catch (err) {
      console.error("Register error:", err);
      setError(t("registrationError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <FormInput
        label={t("firstNamePlaceholder")}
        name="firstName"
        type="text"
        placeholder={t("firstNamePlaceholder")}
        value={formData.firstName}
        onChange={handleChange}
        required
        autoComplete="given-name"
      />

      <FormInput
        label={t("lastNamePlaceholder")}
        name="lastName"
        type="text"
        placeholder={t("lastNamePlaceholder")}
        value={formData.lastName}
        onChange={handleChange}
        required
        autoComplete="family-name"
      />

      <FormInput
        label={t("emailAddress")}
        name="email"
        type="email"
        placeholder={t("emailPlaceholder")}
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />

      <FormInput
        label={t("phonePlaceholder")}
        name="phone"
        type="tel"
        placeholder={t("phonePlaceholder")}
        value={formData.phone}
        onChange={handleChange}
        optional
        autoComplete="tel"
      />

      <div className="space-y-2">
        <FormInput
          label={t("password")}
          name="password"
          type="password"
          placeholder={t("passwordHint")}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">{t("passwordMinLength")}</p>
      </div>

      <div className="space-y-4 pt-2">
        <FormCheckbox
          name="acceptsMarketing"
          checked={formData.acceptsMarketing}
          onChange={handleChange}
          label={t("marketingSubscribe")}
        />

        <FormCheckbox
          name="acceptsPrivacyPolicy"
          checked={formData.acceptsPrivacyPolicy}
          onChange={handleChange}
          label={
            <>
              {t("agreeToPolicy")}{" "}
              <Link href="/policies/privacy-policy" className="text-primary hover:underline" target="_blank">
                {t("privacyPolicy")}
              </Link>{" "}
              <span className="text-destructive">*</span>
            </>
          }
        />
      </div>

      <SubmitButton loading={loading}>{t("createAccount")}</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/account/login" className="text-foreground font-medium hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
