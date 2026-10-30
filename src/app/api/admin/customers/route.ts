import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";
export async function GET(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try {
    const [orders, supplies] = await Promise.all([
      dbRequest("orders?select=customer_name,phone,email,created_at&order=created_at.desc&limit=500", { token }),
      dbRequest("supply_requests?select=customer_name,organization_name,phone,email,created_at&order=created_at.desc&limit=500", { token }),
    ]);
    const map = new Map<string,{ name:string; phone:string; email:string|null; organization:string|null; last:string }>();
    for (const r of [...(orders || []), ...(supplies || [])]) {
      const key = String(r.phone || "").replace(/\s/g, "");
      if (!key) continue;
      const old=map.get(key);
      if (!old || r.created_at > old.last) map.set(key, { name:r.customer_name, phone:r.phone, email:r.email, organization:r.organization_name || old?.organization || null, last:r.created_at });
    }
    return NextResponse.json({ customers: [...map.values()].sort((a,b)=>b.last.localeCompare(a.last)) }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) { return apiError(e); }
}
