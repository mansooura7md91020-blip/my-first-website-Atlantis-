"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { TextField, TextAreaField, SelectField } from "@/components/ui/form-fields";
import { Button, LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink, renderTemplate } from "@/lib/utils/whatsapp";
import { companySettings } from "@/lib/data/company-settings";

const orgTypeKeys = ["restaurant", "cafe", "school", "hospital", "university", "company", "other"] as const;

export default function SupplyRequestPage() {
  const { t, locale } = useI18n();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    organizationName: "",
    organizationType: "restaurant",
    phone: "",
    email: "",
    products: "",
    deliveryLocation: "",
    deliveryDate: "",
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this creates a row in Supabase `supply_requests`
    // (status "new") for an admin to review and turn into a quotation.
    // Payment terms are never set here — they're agreed per quotation.
    const requestId = `SR-${Math.floor(100 + Math.random() * 900)}`;
    setSubmitted(requestId);
  }

  if (submitted) {
    const message = renderTemplate(companySettings.whatsappTemplates.supplyRequestReceived[locale], {});
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-text">{t("supplyRequest.successTitle")}</h1>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          {t("supplyRequest.successBody", { requestId: submitted })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={buildWhatsAppLink(companySettings.whatsapp, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#1FAF5C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#1c9e53]"
          >
            {t("common.whatsappUs")}
          </a>
          <LinkButton href={`/${locale}`} variant="outline">
            {t("common.backToHome")}
          </LinkButton>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <SectionHeading title={t("supplyRequest.title")} subtitle={t("supplyRequest.subtitle")} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 card-shadow rounded-2xl border border-border bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("supplyRequest.customerName")}
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
          <TextField
            label={t("supplyRequest.organizationName")}
            required
            value={form.organizationName}
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
          />
        </div>

        <SelectField
          label={t("supplyRequest.organizationType")}
          value={form.organizationType}
          onChange={(e) => setForm({ ...form, organizationType: e.target.value })}
        >
          {orgTypeKeys.map((key) => (
            <option key={key} value={key}>
              {t(`supplyRequest.orgTypes.${key}`)}
            </option>
          ))}
        </SelectField>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("supplyRequest.phone")}
            type="tel"
            dir="ltr"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            label={t("supplyRequest.email")}
            type="email"
            dir="ltr"
            hint={t("common.optional")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <TextAreaField
          label={t("supplyRequest.productsNeeded")}
          required
          placeholder={t("supplyRequest.productsPlaceholder")}
          value={form.products}
          onChange={(e) => setForm({ ...form, products: e.target.value })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("supplyRequest.deliveryLocation")}
            required
            value={form.deliveryLocation}
            onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })}
          />
          <TextField
            label={t("supplyRequest.requestedDeliveryDate")}
            type="date"
            hint={t("common.optional")}
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
          />
        </div>

        <TextAreaField
          label={t("supplyRequest.notes")}
          hint={t("common.optional")}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <Button type="submit" className="w-full sm:w-auto">
          {t("supplyRequest.submit")}
        </Button>
      </form>
    </Container>
  );
}
