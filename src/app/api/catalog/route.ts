import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { getCompanySettings } from "@/lib/data/company-settings";
export async function GET() {
  try {
    const [products, categories, settings] = await Promise.all([getProducts(), getCategories(), getCompanySettings()]);
    return NextResponse.json({ products, categories, settings }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Catalog temporarily unavailable." }, { status: 503 });
  }
}
