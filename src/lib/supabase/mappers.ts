import { Category, CompanySettings, PriceTier, Product, Unit } from "@/lib/types";
import { companySettings } from "@/lib/data/company-settings";

export type DbCategory = {
  id: string; slug: string; name_ar: string; name_en: string;
  description_ar: string | null; description_en: string | null;
  image_url: string | null; is_active: boolean; sort_order?: number;
};
export type DbProduct = {
  id: string; slug: string; category_id: string;
  name_ar: string; name_en: string;
  description_ar: string | null; description_en: string | null;
  image_urls: unknown; unit: string; min_order_qty: number;
  price_tiers: unknown; stock_qty: number | null;
  in_stock: boolean; is_active: boolean; sort_order?: number;
};
export type DbSettings = {
  id: number; catalog_live?: boolean; company_name_ar: string | null; company_name_en: string | null;
  logo_url: string | null; facebook_url?: string | null; phone: string | null; whatsapp: string | null;
  email: string | null; address_ar: string | null; address_en: string | null;
};

export function mapCategory(row: DbCategory): Category {
  return {
    id: row.id, slug: row.slug,
    name: { ar: row.name_ar || "", en: row.name_en || "" },
    description: { ar: row.description_ar || "", en: row.description_en || "" },
    image: row.image_url || "/images/products/floor-cleaner.jpg",
    sectors: [],
  };
}

export function parseTiers(raw: unknown): PriceTier[] {
  if (!Array.isArray(raw)) return [{ minQty: 1, maxQty: null, pricePerUnit: null }];
  return raw.map((p) => ({
    minQty: Number(p.minQty ?? p.min_qty ?? 1),
    maxQty: p.maxQty == null && p.max_qty == null ? null : Number(p.maxQty ?? p.max_qty),
    pricePerUnit: p.pricePerUnit == null && p.price_per_unit == null ? null : Number(p.pricePerUnit ?? p.price_per_unit),
  }));
}

export function mapProduct(row: DbProduct): Product {
  const images = Array.isArray(row.image_urls) ? row.image_urls.filter((u): u is string => typeof u === "string") : [];
  return {
    id: row.id, slug: row.slug, categoryId: row.category_id,
    name: { ar: row.name_ar || "", en: row.name_en || "" },
    shortDescription: { ar: row.description_ar || "", en: row.description_en || "" },
    description: { ar: row.description_ar || "", en: row.description_en || "" },
    images: images.length ? images : ["/images/products/floor-cleaner.jpg"],
    unit: (row.unit || "piece") as Unit,
    minOrderQty: Math.max(1, Number(row.min_order_qty || 1)),
    priceTiers: parseTiers(row.price_tiers),
    inStock: !!row.in_stock,
    stockQty: Number(row.stock_qty || 0),
    isDemo: false,
  };
}

export function mapSettings(row: DbSettings): CompanySettings {
  return {
    ...companySettings,
    legalName: { ar: row.company_name_ar || companySettings.legalName.ar, en: row.company_name_en || companySettings.legalName.en },
    phone: row.phone ?? companySettings.phone,
    facebookUrl: row.facebook_url ?? companySettings.facebookUrl,
    logoUrl: row.logo_url || companySettings.logoUrl || null,
    catalogLive: row.catalog_live === true,
    whatsapp: row.whatsapp ?? companySettings.whatsapp,
    email: row.email ?? companySettings.email,
    address: { ar: row.address_ar || "", en: row.address_en || "" },
  };
}
