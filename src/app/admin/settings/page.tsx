"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { companySettings as initialSettings } from "@/lib/data/company-settings";
import { TextField, TextAreaField } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { CompanySettings } from "@/lib/types";

export default function AdminSettingsPage() {
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
        title="Settings"
        description="Everything below is what the public site reads for contact details, WhatsApp messages and payment guidance — nothing is hard-coded in the UI."
        action={
          <Button size="sm" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save changes"}
          </Button>
        }
      />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Company information</h2>
          <TextField
            label="Legal name (Arabic)"
            dir="rtl"
            value={settings.legalName.ar}
            onChange={(e) => setSettings({ ...settings, legalName: { ...settings.legalName, ar: e.target.value } })}
          />
          <TextField
            label="Legal name (English)"
            value={settings.legalName.en}
            onChange={(e) => setSettings({ ...settings, legalName: { ...settings.legalName, en: e.target.value } })}
          />
          <TextField
            label="Brand name (shown in header)"
            value={settings.brandName}
            onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Sales & contact</h2>
          <TextField
            label="Sales representative name"
            value={settings.salesRepresentative.name}
            onChange={(e) =>
              setSettings({ ...settings, salesRepresentative: { ...settings.salesRepresentative, name: e.target.value } })
            }
          />
          <TextField
            label="Sales representative phone"
            dir="ltr"
            value={settings.salesRepresentative.phone}
            onChange={(e) =>
              setSettings({ ...settings, salesRepresentative: { ...settings.salesRepresentative, phone: e.target.value } })
            }
          />
          <TextField
            label="Company phone"
            dir="ltr"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          />
          <TextField
            label="WhatsApp number"
            dir="ltr"
            value={settings.whatsapp}
            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
          />
          <TextField
            label="Email"
            dir="ltr"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          />
          <TextField
            label="Facebook page URL"
            dir="ltr"
            placeholder="https://facebook.com/…"
            hint="Leave empty until the real page exists — the footer only shows a Facebook link when this is set."
            value={settings.facebookUrl ?? ""}
            onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value || null })}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Payment terms guidance</h2>
          <p className="text-xs text-text-muted">
            This note is shown to customers as general guidance only. It is never a binding policy — actual terms
            (deposit, full payment, bank transfer, etc.) are set per order in Orders and per quotation in Quotations.
          </p>
          <TextAreaField
            label="Note (English)"
            value={settings.defaultPaymentTermsNote.en}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultPaymentTermsNote: { ...settings.defaultPaymentTermsNote, en: e.target.value },
              })
            }
          />
          <TextAreaField
            label="Note (Arabic)"
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
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">WhatsApp message templates</h2>
          <p className="text-xs text-text-muted">
            Used to pre-fill wa.me links in v1. Use <code>{"{orderId}"}</code> as a placeholder. These become the
            starting templates for WhatsApp Business API messages once that integration exists.
          </p>
          {(
            [
              ["orderReceived", "Order received"],
              ["orderConfirmed", "Order confirmed"],
              ["orderPreparing", "Order preparing"],
              ["supplyRequestReceived", "Supply request received"],
              ["generalInquiry", "General inquiry (WhatsApp button)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="grid gap-3 sm:grid-cols-2">
              <TextField
                label={`${label} (English)`}
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
                label={`${label} (Arabic)`}
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
