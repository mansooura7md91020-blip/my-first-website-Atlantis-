import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";

export async function GET(request: NextRequest) {
  const token = await adminApiToken(request);
  if (typeof token !== "string") return token;
  try {
    const [categories, products, settings] = await Promise.all([
      dbRequest("categories?select=*&order=sort_order.asc,created_at.asc", { token }),
      dbRequest("products?select=*&order=sort_order.asc,created_at.desc", { token }),
      dbRequest("company_settings?select=*&id=eq.1", { token }),
    ]);
    return NextResponse.json({ categories, products, settings: settings?.[0] || null }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
