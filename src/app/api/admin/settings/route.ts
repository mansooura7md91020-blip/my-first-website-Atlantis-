import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError, jsonInput } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";

function trim(x: unknown, max: number) { return typeof x === "string" ? x.trim().slice(0, max) : ""; }
export async function PUT(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try {
    const input = await jsonInput(request);
    const fb = trim(input.facebook_url, 1000);
    const logo = trim(input.logo_url, 1000);
    if (fb && !/^https:\/\/(www\.)?(facebook\.com|fb\.com)\//i.test(fb)) throw new Error("Invalid Facebook page URL");
    if (logo && !logo.startsWith("/logo/") && !/^https:\/\//i.test(logo)) throw new Error("Invalid logo URL");
    if (input.catalog_live === true) {
      const [products, categories] = await Promise.all([
        dbRequest("products?select=id&is_active=eq.true&limit=1", { token }),
        dbRequest("categories?select=id&is_active=eq.true&limit=1", { token }),
      ]);
      if (!products?.length || !categories?.length) throw new Error("Add at least one active product and an active category before publishing.");
    }
    const data = {
      id: 1, catalog_live: input.catalog_live === true, company_name_ar: trim(input.company_name_ar, 300),
      company_name_en: trim(input.company_name_en, 300),
      phone: trim(input.phone, 50), whatsapp: trim(input.whatsapp, 50),
      email: trim(input.email, 254), facebook_url: fb, logo_url: logo,
      address_ar: trim(input.address_ar, 500),
      address_en: trim(input.address_en, 500),
    };
    const updated = await dbRequest("company_settings?on_conflict=id", {
      method: "POST", token, body: data,
      extraHeaders: { Prefer: "resolution=merge-duplicates,return=representation" },
    });
    return NextResponse.json({ row: updated?.[0] });
  } catch (e) { return apiError(e); }
}
