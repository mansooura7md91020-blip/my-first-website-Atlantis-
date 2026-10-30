import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError, jsonInput, validUuid } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";
export async function GET(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { const orders = await dbRequest("orders?select=*&order=created_at.desc&limit=250", { token }); return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } }); }
  catch(e) { return apiError(e); }
}
export async function PATCH(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { const b = await jsonInput(request); if (!validUuid(b.id)) throw new Error("Invalid order id");
    const status = String(b.status ?? ""); if (!["received","confirmed","preparing","out_for_delivery","delivered","cancelled"].includes(status)) throw new Error("Invalid status");
    const payment_terms = typeof b.payment_terms === "string" ? b.payment_terms.trim().slice(0,500) : null;
    const rows = await dbRequest(`orders?id=eq.${b.id}`, { method: "PATCH", token, body: { status, payment_terms }, extraHeaders: { Prefer: "return=representation" } });
    return rows?.[0] ? NextResponse.json({ row: rows[0] }) : NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch(e) { return apiError(e); }
}
