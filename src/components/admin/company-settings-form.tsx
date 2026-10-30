"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { companySettings as defaults } from "@/lib/data/company-settings";

type SettingsForm = { catalog_live: boolean; company_name_ar: string; company_name_en: string; phone: string; whatsapp: string; email: string; logo_url: string; facebook_url: string; address_ar: string; address_en: string };
const empty: SettingsForm = {
  catalog_live: false,
  company_name_ar: defaults.legalName.ar, company_name_en: defaults.legalName.en,
  phone: defaults.phone, whatsapp: defaults.whatsapp, email: defaults.email,
  logo_url: "", facebook_url: defaults.facebookUrl || "",
  address_ar: defaults.address.ar, address_en: defaults.address.en,
};
export function CompanySettingsForm() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const [form, setForm] = useState<SettingsForm>(empty);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  useEffect(() => { fetch("/api/admin/catalog").then(async r => { const x = await r.json(); if (!r.ok) throw new Error(x.error); setForm({ ...empty, ...(x.settings || {}) }); }).catch(e => setError(e.message)).finally(() => setBusy(false)); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setNotice(ar ? "تم حفظ إعدادات الشركة في Supabase" : "Company settings saved to Supabase");
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  }
  async function uploadLogo(file?: File) {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed");
      setForm(prev => ({ ...prev, logo_url: result.url }));
      setNotice(ar ? "تم رفع اللوجو. اضغط حفظ لتطبيقه على الموقع." : "Logo uploaded. Save settings to publish it.");
    } catch(e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  }
  const fields: { key: Exclude<keyof SettingsForm, "catalog_live">; label: string }[] = [
    { key: "company_name_ar", label: "اسم الشركة بالعربي" }, { key: "company_name_en", label: "Company name (English)" },
    { key: "phone", label: "Phone" }, { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" }, { key: "logo_url", label: "Logo URL" }, { key: "facebook_url", label: "Facebook Page URL" }, { key: "address_ar", label: "العنوان بالعربي" }, { key: "address_en", label: "Address (English)" },
  ];
  return <section className="space-y-5"><h1 className="text-2xl font-bold text-text">{ar ? "إعدادات الشركة" : "Company settings"}</h1>
    <p className="text-sm text-text-muted">{ar ? "الحقول المعروضة هنا هي الحقول التي تدعمها قاعدة البيانات الحالية." : "These fields match your current database."}</p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="text-text">{notice}</p>}
    <form onSubmit={save} className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2">
      <div className="sm:col-span-2 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={form.catalog_live} onChange={e => setForm(x => ({ ...x, catalog_live: e.target.checked }))} />{ar ? "تفعيل عرض المنتجات الحقيقية للزوار (Publish Catalog)" : "Publish real catalog to visitors"}</label>
        <p className="mt-2">{ar ? "لا تفعّل هذا الخيار إلا بعد تجهيز جميع الأقسام والمنتجات والأسعار الحقيقية! عند التفعيل، سيتوقف عرض عينات DEMO وتظهر منتجات Supabase بدلًا منها." : "Leave this off until all real products and prices are ready. Publishing replaces all DEMO examples with your Supabase catalog."}</p>
      </div>
      {fields.map(({ key, label }) => <label key={key} className="block text-sm font-medium text-text">{label}<input dir={key.endsWith("_ar") ? "rtl" : "ltr"} type="text" value={form[key]} onChange={e => setForm(x => ({ ...x, [key]: e.target.value }))} className="mt-1 block w-full rounded-lg border border-border bg-bg p-2.5" /></label>)}
      <label className="sm:col-span-2 block text-sm font-medium text-text">{ar ? "تغيير لوجو الموقع (PNG أو WebP أو JPG)" : "Upload site logo"}
        <input type="file" accept="image/png,image/webp,image/jpeg" onChange={e => uploadLogo(e.target.files?.[0])} className="mt-2 block w-full text-sm" disabled={uploading}/>
        {form.logo_url && <img src={form.logo_url} alt="Preview of uploaded logo" className="mt-2 max-h-24 max-w-xs object-contain"/>}
      </label>
      <div className="sm:col-span-2"><button type="submit" disabled={busy || uploading} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? (ar ? "تحميل..." : "Loading...") : (ar ? "حفظ في Supabase" : "Save to Supabase")}</button></div>
    </form>
  </section>;
}
