"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import type { ShippingZone } from "@/lib/supabase/shipping";

type ZoneForm = Omit<ShippingZone, "id"> & { id?: string };
const empty: ZoneForm = { name_ar: "", name_en: "", fee: null, quote_only: true, is_active: true, sort_order: 0 };
export function ShippingManager() {
  const { locale } = useI18n(); const ar = locale === "ar";
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [form, setForm] = useState<ZoneForm>({ ...empty });
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false);
  const [error, setError] = useState(""), [notice, setNotice] = useState("");
  async function api(method = "GET", payload?: unknown) {
    const response = await fetch("/api/admin/shipping", { method, headers: payload ? { "Content-Type": "application/json" } : undefined, body: payload ? JSON.stringify(payload) : undefined, cache: "no-store" });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || "Request failed"); return data;
  }
  async function reload() { const data = await api(); setZones(data.zones || []); }
  useEffect(() => { reload().catch(e => setError(e.message)); }, []);
  function change<K extends keyof ZoneForm>(key: K, value: ZoneForm[K]) { setForm(prev => ({ ...prev, [key]: value })); }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try { await api(form.id ? "PATCH" : "POST", form); await reload(); setOpen(false); setForm({ ...empty }); setNotice(ar ? "تم حفظ منطقة الشحن" : "Shipping zone saved"); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed"); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm(ar ? "حذف منطقة الشحن؟ الطلبات السابقة تحتفظ باسم المنطقة." : "Delete this shipping zone?")) return;
    setBusy(true); setError("");
    try { await api("DELETE", { id }); await reload(); } catch (err) { setError(err instanceof Error ? err.message : "Failed"); } finally { setBusy(false); }
  }
  const input = "mt-1 w-full rounded-lg border border-border bg-bg p-2.5 text-text";
  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold text-text">{ar ? "أسعار الشحن والمناطق" : "Shipping zones & fees"}</h1><p className="text-sm text-text-muted">{ar ? "حدد لكل محافظة أو منطقة رسومًا أو اختر عرض سعر بعد المراجعة." : "Set fees per region or request a shipping quote."}</p></div><button className="rounded-lg bg-brand px-4 py-2 text-white" onClick={() => { setForm({ ...empty }); setOpen(true); }}>{ar ? "+ إضافة منطقة" : "+ Add zone"}</button></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-surface-muted p-3 text-text">{notice}</p>}
    {open && <form onSubmit={save} className="space-y-4 rounded-xl border border-border bg-surface p-5"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-text">الاسم بالعربية<input className={input} required value={form.name_ar} onChange={e => change("name_ar",e.target.value)} /></label><label className="text-sm text-text">Name in English<input className={input} required value={form.name_en} onChange={e => change("name_en",e.target.value)} /></label></div>
    <label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" checked={form.quote_only} onChange={e => change("quote_only",e.target.checked)} />{ar ? "الشحن يُحدد بعد مراجعة الطلب (بدون سعر ثابت)" : "Shipping fee by quotation"}</label>
    {!form.quote_only && <label className="block text-sm text-text">{ar ? "رسوم الشحن بالجنيه" : "Shipping fee EGP"}<input type="number" min="0" step="0.01" required className={input} value={form.fee ?? ""} onChange={e => change("fee", e.target.value === "" ? null : Number(e.target.value))}/></label>}
    <label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" checked={form.is_active} onChange={e => change("is_active",e.target.checked)} />{ar ? "المنطقة ظاهرة للزوار" : "Zone available to customers"}</label>
    <label className="block text-sm text-text">{ar ? "ترتيب العرض" : "Sort order"}<input type="number" min="0" className={input} value={form.sort_order} onChange={e => change("sort_order",Number(e.target.value))}/></label>
    <div className="flex gap-2"><button disabled={busy} type="submit" className="rounded-lg bg-brand px-5 py-2 text-white disabled:opacity-50">{ar ? "حفظ في Supabase" : "Save to Supabase"}</button><button type="button" className="rounded-lg border border-border px-4 py-2 text-text" onClick={() => setOpen(false)}>{ar ? "إلغاء" : "Cancel"}</button></div></form>}
    <div className="overflow-x-auto rounded-xl border border-border bg-surface"><table className="w-full text-sm"><thead className="bg-surface-muted text-text"><tr><th className="p-3 text-start">{ar ? "المنطقة" : "Zone"}</th><th className="p-3 text-start">{ar ? "رسوم الشحن" : "Fee"}</th><th className="p-3 text-start">{ar ? "الحالة" : "Status"}</th><th className="p-3 text-start">{ar ? "الإجراءات" : "Actions"}</th></tr></thead><tbody>{zones.map(z => <tr key={z.id} className="border-t border-border"><td className="p-3 text-text">{ar ? z.name_ar : z.name_en}</td><td className="p-3 text-text">{z.quote_only ? (ar ? "بعد المراجعة" : "Quoted") : `${z.fee ?? 0} EGP`}</td><td className="p-3 text-text">{z.is_active ? (ar ? "ظاهر" : "Active") : (ar ? "مخفي" : "Hidden")}</td><td className="p-3"><div className="flex gap-2"><button className="rounded border border-border px-3 py-1 text-text" onClick={() => { setForm(z); setOpen(true); }}>{ar ? "تعديل" : "Edit"}</button><button className="rounded border border-red-200 px-3 py-1 text-red-700" disabled={busy} onClick={() => remove(z.id)}>{ar ? "حذف" : "Delete"}</button></div></td></tr>)}</tbody></table>{zones.length === 0 && <p className="p-5 text-text-muted">{ar ? "لا توجد مناطق شحن بعد. أضف منطقة قبل تفعيل حفظ الطلبات." : "No shipping zones yet."}</p>}</div>
  </section>;
}
