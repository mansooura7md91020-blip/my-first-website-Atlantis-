import { NextRequest, NextResponse } from "next/server";
import { dbRequest, supabaseConfig } from "@/lib/supabase/rest";
const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!supabaseConfig()) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 16000) return NextResponse.json({ error: "Too large" }, { status: 413 });
    const b = await request.json();
    if (b?.website) return NextResponse.json({ ok: true });
    const row = {
      id: crypto.randomUUID(), customer_name: clean(b.customerName,180), organization_name: clean(b.organizationName,180),
      organization_type: clean(b.organizationType,50) || "other", phone: clean(b.phone,40),
      email: clean(b.email,254) || null, products_needed: clean(b.products,3000),
      delivery_location: clean(b.deliveryLocation,600), requested_delivery_date: clean(b.deliveryDate,10) || null,
      notes: clean(b.notes,1500), status: "new",
    };
    if (row.customer_name.length < 2 || row.organization_name.length < 2 || row.phone.length < 6 || !row.products_needed || !row.delivery_location || (row.email && !/^\S+@\S+\.\S+$/.test(row.email))) throw new Error("Please complete all required fields correctly.");
    if (row.requested_delivery_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.requested_delivery_date)) throw new Error("Invalid date");
    await dbRequest("supply_requests", { method: "POST", body: row });
    return NextResponse.json({ ok: true, requestId: row.id }, { status: 201 });
  } catch(err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Submission failed" }, { status: 400 }); }
}
