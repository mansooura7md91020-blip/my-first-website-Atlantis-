import { NextResponse } from "next/server";
import { getShippingZones } from "@/lib/supabase/shipping";
export async function GET() {
  try { return NextResponse.json({ zones: await getShippingZones() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Shipping options unavailable" }, { status: 503 }); }
}
