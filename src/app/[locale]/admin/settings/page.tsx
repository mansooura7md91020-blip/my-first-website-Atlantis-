"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { companySettings as initialSettings } from "@/lib/data/company-settings";
import { TextField, TextAreaField } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { CompanySettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In production this writes to the single-row Supabase `company_settings`
    // table. Nothing here is persisted beyond this session in the preview.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <AdminPageHeader
        title={t("admin.settings.title")}
        description={t("admin.settings.description")}
        action={
          <Button size="sm" onClick={handleSave}>
            {saved ? t("admin.settings.saved") : t("admin.settings.saveChanges")}
          </Button>
        }
      />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("admin.settings.sectionCompany")}
          </h2>
          <TextField
            label={t("admin.settings.legalNameAr")}
            dir="rtl"
            value={settings.legalName.ar}
            onChange={(e) => setSettings({ ...settings, legalName: { ...settings.legalName, ar: e.target.value } })}
          />
          <TextField
            label={t("admin.settings.legalNameEn")}
            value={settings.legalName.en}
            onChange={(e) => setSettings({ ...settings, legalName: { ...settings.legalName, en: e.target.value } })}
          />
          <TextField
            label={t("admin.settings.brandName")}
            value={settings.brandName}
            onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("admin.settings.sectionContact")}
          </h2>
          <TextField
            label={t("admin.settings.salesRepName")}
            value={settings.salesRepresentative.name}
            onChange={(e) =>
              setSettings({ ...settings, salesRepresentative: { ...settings.salesRepresentative, name: e.target.value } })
            }
          />
          <TextField
            label={t("admin.settings.salesRepPhone")}
            dir="ltr"
            value={settings.salesRepresentative.phone}
            onChange={(e) =>
              setSettings({ ...settings, salesRepresentative: { ...settings.salesRepresentative, phone: e.target.value } })
            }
          />
          <TextField
            label={t("admin.settings.companyPhone")}
            dir="ltr"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          />
          <TextField
            label={t("admin.settings.whatsappNumber")}
            dir="ltr"
            value={settings.whatsapp}
            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
          />
          <TextField
            label={t("admin.settings.email")}
            dir="ltr"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          />
          <TextField
            label={t("admin.settings.facebookUrl")}
            dir="ltr"
            placeholder="https://facebook.com/…"
            hint={t("admin.settings.facebookHint")}
            value={settings.facebookUrl ?? ""}
            onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value || null })}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("admin.settings.sectionPayment")}
          </h2>
          <p className="text-xs text-text-muted">{t("admin.settings.paymentNoteHint")}</p>
          <TextAreaField
            label={t("admin.settings.noteEnglish")}
            value={settings.defaultPaymentTermsNote.en}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultPaymentTermsNote: { ...settings.defaultPaymentTermsNote, en: e.target.value },
              })
            }
          />
          <TextAreaField
            label={t("admin.settings.noteArabic")}
            dir="rtl"
            value={settings.defaultPaymentTermsNote.ar}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultPaymentTermsNote: { ...settings.defaultPaymentTermsNote, ar: e.target.value },
              })
            }
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("admin.settings.sectionWhatsapp")}
          </h2>
          <p className="text-xs text-text-muted">{t("admin.settings.templatesHint")}</p>
          {(
            [
              ["orderReceived", "templateOrderReceived"],
              ["orderConfirmed", "templateOrderConfirmed"],
              ["orderPreparing", "templateOrderPreparing"],
              ["supplyRequestReceived", "templateSupplyReceived"],
              ["generalInquiry", "templateGeneralInquiry"],
            ] as const
          ).map(([key, labelKey]) => (
            <div key={key} className="grid gap-3 sm:grid-cols-2">
              <TextField
                label={`${t(`admin.settings.${labelKey}`)} (${t("admin.settings.english")})`}
                value={settings.whatsappTemplates[key].en}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsappTemplates: {
                      ...settings.whatsappTemplates,
                      [key]: { ...settings.whatsappTemplates[key], en: e.target.value },
                    },
                  })
                }
              />
              <TextField
                label={`${t(`admin.settings.${labelKey}`)} (${t("admin.settings.arabic")})`}
                dir="rtl"
                value={settings.whatsappTemplates[key].ar}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsappTemplates: {
                      ...settings.whatsappTemplates,
                      [key]: { ...settings.whatsappTemplates[key], ar: e.target.value },
                    },
                  })
                }
              />
            </div>
          ))}
        </section>
      </form>
    </div>
  );
}
