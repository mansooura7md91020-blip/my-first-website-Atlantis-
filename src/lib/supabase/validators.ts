import { PriceTier } from "@/lib/types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const clean = (x: unknown, limit = 300) => typeof x === "string" ? x.trim().slice(0, limit) : "";
const bool = (x: unknown) => x === true;
const nonnegativeInt = (x: unknown) => Number.isSafeInteger(Number(x)) && Number(x) >= 0 ? Number(x) : 0;

export function validateCategory(input: Record<string, unknown>) {
  const slug = clean(input.slug, 120).toLowerCase();
  const name_ar = clean(input.name_ar);
  const name_en = clean(input.name_en);
  if (!slugPattern.test(slug) || !name_ar || !name_en) throw new Error("Valid slug and both category names are required.");
  const image_url = clean(input.image_url, 1000);
  if (image_url && !image_url.startsWith("/") && !/^https:\/\//.test(image_url)) throw new Error("Invalid image URL");
  return {
    slug, name_ar, name_en,
    description_ar: clean(input.description_ar, 2000),
    description_en: clean(input.description_en, 2000),
    image_url: image_url || null,
    is_active: bool(input.is_active),
    sort_order: nonnegativeInt(input.sort_order),
  };
}

export function validateProduct(input: Record<string, unknown>) {
  const slug = clean(input.slug, 120).toLowerCase();
  const name_ar = clean(input.name_ar);
  const name_en = clean(input.name_en);
  const category_id = clean(input.category_id, 50);
  const units = ["piece", "pack", "carton", "kg", "liter", "box", "roll"];
  const unit = clean(input.unit);
  if (!slugPattern.test(slug) || !name_ar || !name_en || !/^[a-f0-9-]{36}$/i.test(category_id) || !units.includes(unit)) {
    throw new Error("Valid slug, bilingual product names, category and unit are required.");
  }
  const images = Array.isArray(input.image_urls) ? input.image_urls : [];
  if (images.length > 8 || images.some((x) => typeof x !== "string" || x.length > 1000 || (!x.startsWith("/") && !x.startsWith("https://")))) throw new Error("Invalid product images.");
  const tierInput = input.price_tiers;
  if (!Array.isArray(tierInput) || tierInput.length < 1 || tierInput.length > 10) throw new Error("Add at least one valid price tier.");
  const tiers: PriceTier[] = tierInput.map((x) => {
    const t = x as Record<string, unknown>;
    const minQty = Number(t.minQty);
    const maxQty = t.maxQty === null || t.maxQty === "" ? null : Number(t.maxQty);
    const pricePerUnit = t.pricePerUnit === null || t.pricePerUnit === "" ? null : Number(t.pricePerUnit);
    if (!Number.isSafeInteger(minQty) || minQty < 1 || (maxQty !== null && (!Number.isSafeInteger(maxQty) || maxQty < minQty)) || (pricePerUnit !== null && (!Number.isFinite(pricePerUnit) || pricePerUnit < 0))) {
      throw new Error("Invalid quantity/price tier.");
    }
    return { minQty, maxQty, pricePerUnit };
  });
  tiers.sort((a, b) => a.minQty - b.minQty);
  if (tiers[0].minQty !== 1 || tiers[tiers.length - 1].maxQty !== null) throw new Error("Price tiers must start at 1 and end with an open maximum.");
  for (let i = 1; i < tiers.length; i++) {
    if (tiers[i - 1].maxQty === null || tiers[i].minQty !== tiers[i - 1].maxQty! + 1) throw new Error("Quantity bands must not overlap or have gaps.");
  }
  const min_order_qty = nonnegativeInt(input.min_order_qty);
  if (min_order_qty < 1) throw new Error("Minimum order quantity must be at least 1.");
  return {
    slug, name_ar, name_en, category_id, unit,
    description_ar: clean(input.description_ar, 3000),
    description_en: clean(input.description_en, 3000),
    image_urls: images,
    price_tiers: tiers,
    min_order_qty,
    stock_qty: nonnegativeInt(input.stock_qty),
    in_stock: bool(input.in_stock), is_active: bool(input.is_active),
    sort_order: nonnegativeInt(input.sort_order),
  };
}
