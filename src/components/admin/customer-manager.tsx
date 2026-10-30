"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
type Customer = { name: string; phone: string; email: string | null; organization: string | null; last: string };
export function CustomerManager() {
  const {locale}=useI18n();const ar=locale==="ar";
  const [rows,setRows]=useState<Customer[]>([]), [error,setError]=useState("");
  useEffect(()=>{fetch("/api/admin/customers", {cache:"no-store"}).then(async r=>{const v=await r.json();if(!r.ok) throw new Error(v.error);setRows(v.customers||[]);}).catch(e=>setError(e.message));},[]);
  return <section className="space-y-4"><h1 className="text-2xl font-bold text-text">{ar?"العملاء المسجلون من الطلبات":"Customers from orders"}</h1><p className="text-sm text-text-muted">{ar?"القائمة تتكوّن تلقائيًا من الطلبات وطلبات التوريد الحقيقية المحفوظة، وتُعرض للمدير فقط.":"Customers are derived from actual saved orders and supply requests."}</p>{error && <p className="rounded-lg bg-red-50 p-3 text-red-700" role="alert">{error}</p>}
  <div className="overflow-x-auto rounded-xl border border-border bg-surface"><table className="w-full text-sm text-text"><thead><tr className="bg-surface-muted"><th className="p-3 text-start">{ar?"الاسم":"Name"}</th><th className="p-3 text-start">{ar?"الجهة":"Organization"}</th><th className="p-3 text-start">{ar?"الهاتف":"Phone"}</th><th className="p-3 text-start">Email</th></tr></thead><tbody>{rows.map(r=><tr key={r.phone} className="border-t border-border"><td className="p-3">{r.name}</td><td className="p-3">{r.organization||"—"}</td><td className="p-3" dir="ltr">{r.phone}</td><td className="p-3">{r.email||"—"}</td></tr>)}</tbody></table>{rows.length===0 && <p className="p-5 text-text-muted">{ar?"لا توجد بيانات عملاء حتى الآن":"No customers yet"}</p>}</div></section>;
}
