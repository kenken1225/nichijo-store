"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { FormInput } from "./FormInput";
import { FormCheckbox } from "./FormCheckbox";
import { SubmitButton } from "./SubmitButton";
import { useTranslations } from "next-intl";

export function ProfileForm() {
  const t = useTranslations("account");
  const { customer, refreshCustomer, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    acceptsMarketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
        acceptsMarketing: false, // This cannot be retrieved from the API, so initial value is false
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/account/customer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("failedProfileUpdate"));
        return;
      }

      setSuccess(true);
      await refreshCustomer();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(t("profileUpdateError"));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {success && (
        <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
          {t("profileUpdated")}
        </div>
      )}

      <div className="p-4 rounded-lg bg-muted/50 text-sm">
        <span className="font-medium">{t("email")}</span>
        <span className="text-muted-foreground">{customer?.email}</span>
        <p className="text-xs text-muted-foreground mt-1">{t("emailNoChange")}</p>
      </div>

      <FormInput label={t("firstName")} name="firstName" value={formData.firstName} onChange={handleChange} required />

      <FormInput label={t("lastName")} name="lastName" value={formData.lastName} onChange={handleChange} required />

      <FormInput label={t("phoneLabel")} name="phone" type="tel" value={formData.phone} onChange={handleChange} optional />

      <FormCheckbox
        name="acceptsMarketing"
        checked={formData.acceptsMarketing}
        onChange={handleChange}
        label={t("marketingEmails")}
      />

      <SubmitButton loading={loading}>{t("saveChanges")}</SubmitButton>
    </form>
  );
}
