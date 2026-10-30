import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError, jsonInput, validUuid } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";
import { getShippingZones } from "@/lib/supabase/shipping";

function zoneInput(input: Record<string, unknown>) {
  const name_ar = String(input.name_ar ?? "").trim().slice(0, 150);
  const name_en = String(input.name_en ?? "").trim().slice(0, 150);
  const quote_only = input.quote_only === true;
  const is_active = input.is_active === true;
  const sort_order = Number(input.sort_order ?? 0);
  const fee = input.fee === "" || input.fee == null ? null : Number(input.fee);
  if (!name_ar || !name_en || name_ar.length < 2 || name_en.length < 2) throw new Error("Both shipping zone names are required.");
  if (!quote_only && (fee === null || !Number.isFinite(fee) || fee < 0 || fee > 1000000)) throw new Error("Enter a valid delivery fee, or select quote only.");
  if (!Number.isInteger(sort_order) || sort_order < 0 || sort_order > 100000) throw new Error("Invalid shipping zone order.");
  return { name_ar, name_en, quote_only, is_active, fee: quote_only ? null : fee, sort_order };
}
export async function GET(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { return NextResponse.json({ zones: await getShippingZones(token) }, { headers: { "Cache-Control": "no-store" } }); }
  catch(e) { return apiError(e); }
}
export async function POST(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { const row = await dbRequest("shipping_zones", { method: "POST", token, body: zoneInput(await jsonInput(request)), extraHeaders: { Prefer: "return=representation" } }); return NextResponse.json({ row: row?.[0] }, { status: 201 }); }
  catch(e) { return apiError(e); }
}
export async function PATCH(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try {
    const input = await jsonInput(request); if (!validUuid(input.id)) throw new Error("Invalid zone ID");
    const row = await dbRequest(`shipping_zones?id=eq.${input.id}`, { method: "PATCH", token, body: zoneInput(input), extraHeaders: { Prefer: "return=representation" } });
    return row?.length ? NextResponse.json({ row: row[0] }) : NextResponse.json({ error: "Zone not found" }, { status: 404 });
  } catch(e) { return apiError(e); }
}
export async function DELETE(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try { const input = await jsonInput(request); if (!validUuid(input.id)) throw new Error("Invalid zone ID"); await dbRequest(`shipping_zones?id=eq.${input.id}`, { method: "DELETE", token }); return NextResponse.json({ ok: true }); }
  catch(e) { return apiError(e); }
}
