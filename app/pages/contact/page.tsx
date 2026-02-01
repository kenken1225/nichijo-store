"use client";

import { useState, useRef, useEffect } from "react";

import { Container } from "@/components/layout/Container";
import { FormInput } from "@/components/account/FormInput";
import { SubmitButton } from "@/components/account/SubmitButton";
import { clsx } from "clsx";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message");
        return;
      }

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-muted-foreground">Have a question? We&apos;d love to hear from you.</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
              Thank you for your message! We&apos;ll get back to you soon.
            </div>
            <button type="button" onClick={() => setSuccess(false)} className="text-sm text-primary hover:underline">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

            <FormInput
              label="Name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              required
              onChange={handleChange}
              ref={inputRef}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              optional
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Comment
                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
              </label>
              <textarea
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                className={clsx(
                  "w-full px-4 py-3 rounded-lg border bg-input-background text-foreground",
                  "placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  "transition-colors resize-none"
                )}
              />
            </div>

            <SubmitButton
              loading={loading}
              disabled={loading || !formData.name || !formData.email || !formData.message}
            >
              Send
            </SubmitButton>
          </form>
        )}
      </div>
    </Container>
  );
}
