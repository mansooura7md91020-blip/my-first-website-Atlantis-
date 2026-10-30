"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { TextField, TextAreaField, SelectField } from "@/components/ui/form-fields";
import { Button, LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink, renderTemplate } from "@/lib/utils/whatsapp";
import { companySettings as defaultSettings } from "@/lib/data/company-settings";
import { usePublicCatalog } from "@/lib/supabase/use-public-catalog";

const orgTypeKeys = ["restaurant", "cafe", "school", "hospital", "university", "company", "other"] as const;

export default function SupplyRequestPage() {
  const { t, locale } = useI18n();
  const { data } = usePublicCatalog();
  const companySettings = data?.settings ?? defaultSettings;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");
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
    website: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/supply-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not submit request");
      setRequestId(result.requestId);
    } catch(err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setBusy(false); }
  }

  if (requestId) return <Container className="max-w-3xl py-20 text-center"><h1 className="text-2xl font-bold text-text">{locale === "ar" ? "تم استلام طلب التوريد" : "Supply request received"}</h1>
    <p className="mt-2 text-text-muted">{locale === "ar" ? "رقم الطلب" : "Reference"}: {requestId.slice(0,8)}</p>
    <a className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-white" href={buildWhatsAppLink(companySettings.whatsapp, `${locale === "ar" ? "متابعة طلب التوريد" : "Follow up supply request"} #${requestId.slice(0,8)}\n${form.organizationName}\n${form.phone}`)} target="_blank" rel="noopener noreferrer">{locale === "ar" ? "متابعة على واتساب (اختياري)" : "Follow up on WhatsApp (optional)"}</a>
  </Container>;

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

        <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full sm:w-auto">
          {busy ? (locale === "ar" ? "جاري التسجيل..." : "Saving...") : (locale === "ar" ? "إرسال طلب التوريد للمراجعة" : "Submit supply request")}
        </Button>
      </form>
    </Container>
  );
}
