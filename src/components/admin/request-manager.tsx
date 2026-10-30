"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";

type OrderRow = { id: string; created_at: string; customer_name: string; phone: string; email: string | null; delivery_address: string; shipping_zone_name: string | null; shipping_fee: number | null; total: number | null; items: Array<{ name_ar: string; name_en: string; quantity: number; line_total: number | null }>; notes: string | null; status: string; payment_terms: string | null };
type SupplyRow = { id: string; created_at: string; customer_name: string; organization_name: string; organization_type: string; phone: string; email: string | null; products_needed: string; delivery_location: string; requested_delivery_date: string | null; notes: string | null; status: string };
const orderStatuses = ["received", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const requestStatuses = ["new", "reviewing", "quoted", "accepted", "declined"];
const arNames: Record<string,string> = { received: "مستلم", confirmed: "مؤكد", preparing: "جاري التجهيز", out_for_delivery: "خرج للتوصيل", delivered: "تم التسليم", cancelled: "ملغي", new: "جديد", reviewing: "تحت المراجعة", quoted: "تم عرض السعر", accepted: "مقبول", declined: "مرفوض" };
export function RequestManager({ kind }: { kind: "orders" | "supply-requests" }) {
  const { locale } = useI18n(); const ar = locale === "ar";
  const [rows, setRows] = useState<(OrderRow | SupplyRow)[]>([]), [error, setError] = useState(""), [notice, setNotice] = useState(""), [busy, setBusy] = useState(false);
  async function api(method="GET", payload?: unknown) {
    const r = await fetch(`/api/admin/${kind}`, { method, headers: payload ? { "Content-Type": "application/json" } : undefined, body: payload ? JSON.stringify(payload) : undefined, cache: "no-store" });
    const data = await r.json(); if (!r.ok) throw new Error(data.error || "Failed"); return data;
  }
  async function reload() { const data=await api(); setRows(data[kind === "orders" ? "orders" : "requests"] ?? []); }
  useEffect(() => { reload().catch(e => setError(e.message)); }, [kind]);
  async function change(row: OrderRow | SupplyRow, status: string, terms?: string) {
    setBusy(true);setError("");setNotice("");
    try { await api("PATCH", { id: row.id, status, ...(kind === "orders" ? { payment_terms: terms ?? (row as OrderRow).payment_terms ?? "" } : {}) }); await reload(); setNotice(ar ? "تم تحديث الحالة" : "Status updated"); }
    catch(e) { setError(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); }
  }
  return <section className="space-y-5"><h1 className="text-2xl font-bold text-text">{kind === "orders" ? (ar ? "طلبات العملاء الحقيقية" : "Customer orders") : (ar ? "طلبات التوريد الحقيقية" : "Supply requests")}</h1><p className="text-sm text-text-muted">{ar ? "الطلبات التي تم إرسالها وحفظها عبر الموقع فقط. الإرسال عبر واتساب وحده لا ينشئ طلبًا هنا." : "Only requests submitted and saved through the site appear here."}</p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}{notice && <p role="status" className="rounded-lg bg-surface-muted p-3 text-text">{notice}</p>}
    {rows.length === 0 && <p className="rounded-xl border border-border bg-surface p-6 text-text-muted">{ar ? "لا توجد طلبات مسجلة بعد." : "No requests recorded yet."}</p>}
    <div className="grid gap-4">{rows.map(row => <article key={row.id} className="rounded-xl border border-border bg-surface p-5 text-sm text-text"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{row.customer_name} {"organization_name" in row ? `— ${row.organization_name}` : ""}</p><p className="text-xs text-text-muted">{new Date(row.created_at).toLocaleString(ar ? "ar-EG" : "en-GB")} • {row.id.slice(0,8)}</p><p dir="ltr">{row.phone} {row.email ? `• ${row.email}` : ""}</p></div><label className="text-text-muted">{ar ? "الحالة" : "Status"}<select disabled={busy} value={row.status} onChange={e => change(row,e.target.value)} className="ms-2 rounded-lg border border-border bg-bg p-2 text-text">{(kind === "orders" ? orderStatuses : requestStatuses).map(v => <option value={v} key={v}>{ar ? arNames[v] : v}</option>)}</select></label></div>
      {"items" in row ? <><p className="mt-3">{ar ? "العنوان" : "Address"}: {row.delivery_address}</p><p>{ar ? "المنطقة" : "Zone"}: {row.shipping_zone_name || "—"} • {ar ? "الشحن" : "Shipping"}: {row.shipping_fee == null ? (ar ? "بعد المراجعة" : "Quoted") : `${row.shipping_fee} EGP`}</p><ul className="mt-2 list-inside list-disc">{(row.items ?? []).map((x,i) => <li key={i}>{ar ? x.name_ar : x.name_en} × {x.quantity} — {x.line_total == null ? (ar ? "عرض سعر" : "Quote") : `${x.line_total} EGP`}</li>)}</ul><p className="mt-2 font-semibold">{ar ? "الإجمالي" : "Total"}: {row.total == null ? (ar ? "بعد المراجعة" : "Quoted") : `${row.total} EGP`}</p><label className="mt-3 block">{ar ? "شروط الدفع بالاتفاق" : "Agreed payment terms"}<input key={row.id + row.payment_terms} id={`terms-${row.id}`} defaultValue={row.payment_terms ?? ""} className="mt-1 w-full rounded-lg border border-border bg-bg p-2" placeholder={ar ? "تحدد بعد التواصل" : "To be agreed"}/></label><button disabled={busy} className="mt-2 rounded-lg border border-border px-3 py-2" onClick={() => change(row,row.status,(document.getElementById(`terms-${row.id}`) as HTMLInputElement)?.value)}>{ar ? "حفظ شروط الدفع" : "Save terms"}</button></> : <><p className="mt-3">{ar ? "المنتجات المطلوبة" : "Requested supplies"}: {row.products_needed}</p><p>{ar ? "التوصيل" : "Delivery"}: {row.delivery_location} {row.requested_delivery_date || ""}</p></>}
      {row.notes && <p className="mt-2 whitespace-pre-wrap text-text-muted">{ar ? "ملاحظات" : "Notes"}: {row.notes}</p>}
    </article>)}</div>
  </section>;
}
