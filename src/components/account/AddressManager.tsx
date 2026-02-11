"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Star, Loader2, X } from "lucide-react";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { useTranslations } from "next-intl";

type CustomerAddress = {
  id: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  provinceCode?: string;
  country?: string;
  countryCodeV2?: string;
  zip?: string;
  phone?: string;
};

type AddressFormData = Omit<CustomerAddress, "id">;

const emptyAddress: AddressFormData = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  zip: "",
  phone: "",
};

export function AddressManager() {
  const t = useTranslations("account");
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyAddress);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
        setDefaultAddressId(data.defaultAddressId || null);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData(emptyAddress);
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      province: address.province || "",
      country: address.country || "",
      zip: address.zip || "",
      phone: address.phone || "",
    });
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData(emptyAddress);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editingAddress) {
        // Update address
        const res = await fetch("/api/account/addresses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAddress.id, address: formData }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || t("failedUpdate"));
          return;
        }
      } else {
        // Add address
        const res = await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: formData }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || t("failedAdd"));
          return;
        }
      }

      await fetchAddresses();
      handleCancel();
    } catch (err) {
      console.error("Address form error:", err);
      setError(t("saveError"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await fetchAddresses();
      } else {
        const data = await res.json();
        alert(data.error || t("failedDelete"));
      }
    } catch (err) {
      console.error("Delete address error:", err);
      alert(t("deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, setAsDefault: true }),
      });

      if (res.ok) {
        setDefaultAddressId(id);
      } else {
        const data = await res.json();
        alert(data.error || t("failedSetDefault"));
      }
    } catch (err) {
      console.error("Set default address error:", err);
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Address Button */}
      {!showForm && (
        <button
          onClick={handleAddNew}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("addNewAddress")}
        </button>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">{editingAddress ? t("editAddress") : t("addNewAddress")}</h3>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label={t("firstName")}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <FormInput label={t("lastName")} name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <FormInput label={t("address")} name="address1" value={formData.address1} onChange={handleChange} required />

            <FormInput
              label={t("apartment")}
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              optional
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label={t("city")} name="city" value={formData.city} onChange={handleChange} required />
              <FormInput label={t("state")} name="province" value={formData.province} onChange={handleChange} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label={t("zip")} name="zip" value={formData.zip} onChange={handleChange} required />
              <FormInput label={t("country")} name="country" value={formData.country} onChange={handleChange} required />
            </div>

            <FormInput label={t("phone")} name="phone" type="tel" value={formData.phone} onChange={handleChange} optional />

            <div className="flex gap-3 pt-4">
              <SubmitButton loading={formLoading}>{editingAddress ? t("updateAddress") : t("addAddress")}</SubmitButton>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-sm font-medium border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-medium mb-2">{t("noAddresses")}</h3>
          <p className="text-muted-foreground">{t("addAddressHint")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${
                address.id === defaultAddressId ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {address.firstName} {address.lastName}
                      {address.id === defaultAddressId && (
                        <span className="ms-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          {t("default")}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>
                        {address.city}, {address.province} {address.zip}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && <p>{address.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {address.id !== defaultAddressId && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={settingDefaultId === address.id}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                      title={t("setAsDefault")}
                    >
                      {settingDefaultId === address.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title={t("edit")}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    title={t("delete")}
                  >
                    {deletingId === address.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
