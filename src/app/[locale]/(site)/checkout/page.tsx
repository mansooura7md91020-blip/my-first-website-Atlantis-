"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { usePublicCatalog } from "@/lib/supabase/use-public-catalog";
import { resolvePrice, formatEGP } from "@/lib/utils/pricing";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { TextField, TextAreaField } from "@/components/ui/form-fields";
import { Button, LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import type { ShippingZone } from "@/lib/supabase/shipping";
import { companySettings as defaultSettings } from "@/lib/data/company-settings";

export default function CheckoutPage() {
  const { t, locale } = useI18n();
  const { lines } = useCart();
  const { data, error, loading } = usePublicCatalog();
  const products = data?.products ?? [];
  const companySettings = data?.settings ?? defaultSettings;
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "", shippingZoneId: "", website: "" });
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedOrderId, setSavedOrderId] = useState("");
  const [savedTotal, setSavedTotal] = useState<number | null>(null);
  useEffect(() => { fetch("/api/shipping", { cache: "no-store" }).then(r => r.json()).then(d => { if (Array.isArray(d.zones)) setZones(d.zones); }).catch(() => {}); }, []);
  const selectedZone = zones.find(z => z.id === form.shippingZoneId);
  const isDemo = products.some(p => p.isDemo);

  const rows = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          if (!product) return null;
          return { line, product, price: resolvePrice(product.priceTiers, line.quantity) };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [lines, products]
  );
  const subtotal = rows.reduce((sum, r) => sum + (r.price.lineTotal ?? 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSubmitError("");
    if (savedOrderId) return;
    // Demo cards are marketing examples, not confirmed prices or actual stock.
    if (isDemo) {
      setSubmitError(locale === "ar" ? "المنتجات والأسعار المعروضة أمثلة فقط. لإتمام طلب حقيقي، تواصل مع المبيعات عبر واتساب." : "These are illustrative products and prices. Contact sales for a real quotation.");
      return;
    }
    if (zones.length > 0 && !selectedZone) { setSubmitError(locale === "ar" ? "اختار منطقة الشحن" : "Select a shipping area"); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items: rows.map(({ line }) => ({ productId: line.productId, quantity: line.quantity })) }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "Saving order failed");
      setSavedOrderId(body.orderId); setSavedTotal(body.total ?? null);
    } catch(error) { setSubmitError(error instanceof Error ? error.message : "Failed to save your order"); }
    finally { setBusy(false); }
  }
  const whatsappMessage = `${locale === "ar" ? "طلب من موقع أطلنتس" : "Atlantis website request"} ${savedOrderId ? `#${savedOrderId.slice(0,8)}` : ""}\n${form.name}\n${form.phone}\n${form.address}`;

  if (loading) return <Container className="py-16 text-text-muted">{locale === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</Container>;
  if (error) return <Container className="py-16 text-danger">{error}</Container>;

  if (savedOrderId) {
    return <Container className="py-20 text-center"><h1 className="text-2xl font-bold text-text">{locale === "ar" ? "تم حفظ طلبك بنجاح" : "Your order is saved"}</h1>
      <p className="mt-3 text-text-muted">{locale === "ar" ? "رقم الطلب" : "Order ID"}: <span dir="ltr">{savedOrderId.slice(0,8)}</span></p>
      <p className="mt-2 text-text-muted">{savedTotal === null ? (locale === "ar" ? "سيتم تحديد السعر النهائي والشحن بعد المراجعة" : "Final price and shipping will be confirmed") : `${formatEGP(savedTotal, locale)} EGP`}</p>
      <a className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-white" href={buildWhatsAppLink(companySettings.whatsapp, whatsappMessage)} target="_blank" rel="noopener noreferrer">{locale === "ar" ? "متابعة الطلب على واتساب (اختياري)" : "Follow up via WhatsApp (optional)"}</a>
    </Container>;
  }
  if (rows.length === 0) {
    return (
      <Container className="py-20 text-center">
        <p className="text-text-muted">{t("cart.empty")}</p>
        <LinkButton href={`/${locale}/products`} className="mt-6">
          {t("cart.continueShopping")}
        </LinkButton>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("checkout.title")} />

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("checkout.contactDetails")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={t("checkout.fullName")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label={t("checkout.phone")}
              type="tel"
              dir="ltr"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <TextField
            label={t("checkout.email")}
            type="email"
            dir="ltr"
            hint={t("common.optional")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label={t("checkout.deliveryAddress")}
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <label className="block text-sm font-medium text-text">{locale === "ar" ? "منطقة الشحن" : "Delivery area"}
            {zones.length ? <select required className="mt-2 w-full rounded-lg border border-border bg-bg p-3 text-text" value={form.shippingZoneId} onChange={e => setForm({ ...form, shippingZoneId: e.target.value })}><option value="">{locale === "ar" ? "اختر المنطقة" : "Choose area"}</option>{zones.map(z => <option key={z.id} value={z.id}>{locale === "ar" ? z.name_ar : z.name_en} — {z.quote_only ? (locale === "ar" ? "يحدد بعد المراجعة" : "Quoted") : `${z.fee ?? 0} EGP`}</option>)}</select> : <p className="mt-2 rounded-lg bg-surface-muted p-3 text-text-muted">{locale === "ar" ? "رسوم الشحن ستحدد بعد مراجعة الطلب" : "Delivery fee will be confirmed after review"}</p>}
          </label>
          <input className="hidden" autoComplete="off" tabIndex={-1} aria-hidden="true" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
          <TextAreaField
            label={t("checkout.notes")}
            placeholder={t("checkout.notesPlaceholder")}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="h-fit space-y-4 card-shadow rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("checkout.orderSummary")}
          </h2>
          <div className="space-y-2 text-sm">
            {rows.map(({ line, product, price }) => (
              <div key={product.id} className="flex justify-between gap-3 text-text-muted">
                <span className="line-clamp-1">
                  {product.name[locale]} × {line.quantity}
                </span>
                <span className="tabular shrink-0 text-text">
                  {price.lineTotal !== null ? formatEGP(price.lineTotal, locale) : "—"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-text-muted">{t("common.subtotal")}</span>
            <span className="tabular text-lg font-bold text-brand-strong">
              {t("common.egp")} {formatEGP(subtotal, locale)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-text-muted"><span>{locale === "ar" ? "الشحن" : "Delivery"}</span><span>{selectedZone && !selectedZone.quote_only ? `${selectedZone.fee ?? 0} EGP` : (locale === "ar" ? "يحدد بعد المراجعة" : "To be confirmed")}</span></div>
          {selectedZone && !selectedZone.quote_only && !rows.some(r => r.price.lineTotal === null) && <p className="text-sm font-bold text-brand-strong">{locale === "ar" ? "الإجمالي شاملاً الشحن" : "Total incl. shipping"}: {formatEGP(subtotal + Number(selectedZone.fee ?? 0),locale)} EGP</p>}
          {isDemo && <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900"><p>{locale === "ar" ? "تنبيه: الكتالوج والأسعار الحالية أمثلة، وليست أسعارًا مؤكدة. تواصل مع المبيعات لطلب عرض سعر حقيقي." : "These are example products and prices. Contact sales for an actual quotation."}</p><a className="mt-2 inline-block rounded-lg bg-[#1FAF5C] px-4 py-2 font-semibold text-white" href={buildWhatsAppLink(companySettings.whatsapp, whatsappMessage)} target="_blank" rel="noopener noreferrer">{locale === "ar" ? "استفسر عبر واتساب" : "Ask via WhatsApp"}</a></div>}
          {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError} {isDemo && <a className="underline" href={buildWhatsAppLink(companySettings.whatsapp, whatsappMessage)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}</p>}
          <p className="rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-text-muted">
            {t("checkout.paymentNotice")}
          </p>
          <Button type="submit" disabled={busy || isDemo} className="w-full">
            {busy ? (locale === "ar" ? "جاري حفظ الطلب..." : "Saving order...") : (locale === "ar" ? "تسجيل الطلب للمراجعة" : "Submit order for review")}
          </Button>
        </div>
      </form>
    </Container>
  );
}
