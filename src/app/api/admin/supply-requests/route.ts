import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError, jsonInput, validUuid } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";
export async function GET(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { const requests = await dbRequest("supply_requests?select=*&order=created_at.desc&limit=250", { token }); return NextResponse.json({ requests }, { headers: { "Cache-Control": "no-store" } }); }
  catch(e) { return apiError(e); }
}
export async function PATCH(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { const b = await jsonInput(request); if (!validUuid(b.id)) throw new Error("Invalid request id");
    const status = String(b.status ?? ""); if (!["new","reviewing","quoted","accepted","declined"].includes(status)) throw new Error("Invalid status");
    const updates: Record<string,unknown> = { status };
    if (b.quoted_amount !== undefined) {
      const amount = b.quoted_amount === "" || b.quoted_amount === null ? null : Number(b.quoted_amount);
      if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 100000000)) throw new Error("Invalid quotation amount");
      updates.quoted_amount = amount;
      for (const field of ["quoted_details", "payment_terms", "delivery_terms"] as const) {
        updates[field] = typeof b[field] === "string" ? b[field].trim().slice(0,2000) : "";
      }
      const valid = b.quoted_valid_until;
      if (valid && (typeof valid !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valid))) throw new Error("Invalid quotation date");
      updates.quoted_valid_until = valid || null;
    }
    const rows = await dbRequest(`supply_requests?id=eq.${b.id}`, { method: "PATCH", token, body: updates, extraHeaders: { Prefer: "return=representation" } });
    return rows?.[0] ? NextResponse.json({ row: rows[0] }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch(e) { return apiError(e); }
}
