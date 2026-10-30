"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { TextField, TextAreaField } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { companySettings } from "@/lib/data/company-settings";

export default function ContactPage() {
  const { t, locale } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would create a lead/inquiry row in Supabase and/or
    // send an email — no backend is wired up in this preview.
    setSent(true);
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <ContactRow label={t("common.callUs")} value={companySettings.phone} dir="ltr" />
          <ContactRow label={t("common.emailUs")} value={companySettings.email} dir="ltr" />
          <ContactRow label={t("contact.salesRep")} value={companySettings.salesRepresentative.name} />
          {companySettings.facebookUrl && (
            <a
              href={companySettings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-soft"
              aria-label={locale === "ar" ? "افتح صفحة أطلنتس على فيسبوك" : "Open Atlantis on Facebook"}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.1 0 2.26.2 2.26.2v2.49H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.88h-2.33v7A10 10 0 0 0 22 12Z" />
              </svg>
              {locale === "ar" ? "تابع أطلنتس على فيسبوك" : "Follow Atlantis on Facebook"}
            </a>
          )}
          <div className="pt-2">
            <WhatsAppButton
              phone={companySettings.whatsapp}
              message={companySettings.whatsappTemplates.generalInquiry[locale]}
              floating={false}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("contact.formTitle")}
          </h2>
          {sent ? (
            <p className="rounded-lg bg-success/10 p-4 text-sm text-success">{t("checkout.successTitle")}</p>
          ) : (
            <>
              <TextField
                label={t("contact.name")}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label={t("checkout.email")}
                type="email"
                dir="ltr"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextAreaField
                label={t("contact.message")}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit" className="w-full">
                {t("contact.send")}
              </Button>
            </>
          )}
        </form>
      </div>
    </Container>
  );
}

function ContactRow({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span dir={dir} className="font-medium text-text">
        {value}
      </span>
    </div>
  );
}
