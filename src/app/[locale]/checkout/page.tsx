"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { products } from "@/lib/data/products";
import { resolvePrice, formatEGP } from "@/lib/utils/pricing";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { TextField, TextAreaField } from "@/components/ui/form-fields";
import { Button, LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink, renderTemplate } from "@/lib/utils/whatsapp";
import { companySettings } from "@/lib/data/company-settings";

export default function CheckoutPage() {
  const { t, locale } = useI18n();
  const { lines, clear } = useCart();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });

  const rows = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          if (!product) return null;
          return { line, product, price: resolvePrice(product.priceTiers, line.quantity) };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [lines]
  );
  const subtotal = rows.reduce((sum, r) => sum + (r.price.lineTotal ?? 0), 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this creates a row in Supabase `orders` (+ `order_lines`)
    // with status "received". No payment is taken here — payment terms are
    // agreed with the customer per the admin-configured process.
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmitted(orderId);
    clear();
  }

  if (submitted) {
    const message = renderTemplate(companySettings.whatsappTemplates.orderReceived[locale], {
      orderId: submitted,
    });
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-text">{t("checkout.successTitle")}</h1>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          {t("checkout.successBody", { orderId: submitted })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={buildWhatsAppLink(companySettings.whatsapp, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {t("checkout.confirmOnWhatsApp")}
          </a>
          <LinkButton href={`/${locale}`} variant="outline">
            {t("common.backToHome")}
          </LinkButton>
        </div>
      </Container>
    );
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
          <TextAreaField
            label={t("checkout.notes")}
            placeholder={t("checkout.notesPlaceholder")}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5">
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
          <p className="rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-text-muted">
            {t("checkout.paymentNotice")}
          </p>
          <Button type="submit" className="w-full">
            {t("checkout.placeOrder")}
          </Button>
        </div>
      </form>
    </Container>
  );
}
