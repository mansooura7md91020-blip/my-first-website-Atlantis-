import { NextRequest, NextResponse } from "next/server";
import { dbRequest, supabaseConfig } from "@/lib/supabase/rest";
import { validUuid } from "@/lib/supabase/route-helpers";
import { getShippingZones } from "@/lib/supabase/shipping";
import { parseTiers, DbProduct } from "@/lib/supabase/mappers";
import { resolvePrice } from "@/lib/utils/pricing";

const text = (v: unknown, max = 600) => typeof v === "string" ? v.trim().slice(0, max) : "";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!supabaseConfig()) return NextResponse.json({ error: "Database is not yet connected" }, { status: 503 });
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 25000) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const body = await request.json();
    if (body?.website) return NextResponse.json({ ok: true }); // honeypot
    const customer_name = text(body?.name, 180);
    const phone = text(body?.phone, 40);
    const email = text(body?.email, 254);
    const delivery_address = text(body?.address, 600);
    const notes = text(body?.notes, 1500);
    const zoneId = body?.shippingZoneId;
    const items = body?.items;
    if (customer_name.length < 2 || phone.length < 6 || delivery_address.length < 4 || (email && !/^\S+@\S+\.\S+$/.test(email))) throw new Error("Enter your name, phone and delivery address.");
    if (zoneId && !validUuid(zoneId)) throw new Error("Select a delivery area.");
    if (!Array.isArray(items) || items.length < 1 || items.length > 30) throw new Error("Select at least one product.");
    const zones = await getShippingZones();
    const zone = zoneId ? zones.find(z => z.id === zoneId) : null;
    if (zoneId && !zone) throw new Error("Shipping area not found.");
    if (!zoneId && zones.length > 0) throw new Error("Select a delivery area.");
    const unique = new Set<string>();
    const lines = [];
    let subtotal = 0;
    let quoted = false;
    for (const item of items) {
      if (!validUuid(item?.productId) || !Number.isSafeInteger(Number(item?.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 100000 || unique.has(item.productId)) throw new Error("Invalid product or quantity.");
      unique.add(item.productId);
      const rows = await dbRequest(`products?select=id,name_ar,name_en,unit,min_order_qty,price_tiers,in_stock,is_active&id=eq.${item.productId}&is_active=eq.true&limit=1`);
      const product = (rows as DbProduct[])[0];
      if (!product || !product.in_stock) throw new Error("A product is no longer available. Refresh your cart.");
      const quantity = Number(item.quantity);
      if (quantity < product.min_order_qty) throw new Error("Quantity below product minimum.");
      const price = resolvePrice(parseTiers(product.price_tiers), quantity);
      if (price.lineTotal === null) quoted = true;
      else subtotal += price.lineTotal;
      lines.push({ product_id: product.id, name_ar: product.name_ar, name_en: product.name_en, unit: product.unit, quantity, unit_price: price.unitPrice, line_total: price.lineTotal });
    }
    const shippingFee = !zone || zone.quote_only ? null : Number(zone.fee ?? 0);
    const finalSubtotal = quoted ? null : Math.round(subtotal * 100) / 100;
    const finalTotal = finalSubtotal === null || shippingFee === null ? null : Math.round((finalSubtotal + shippingFee) * 100) / 100;
    const orderId = crypto.randomUUID();
    await dbRequest("orders", { method: "POST", body: {
      id: orderId, customer_name, phone, email: email || null, delivery_address,
      notes, shipping_zone_id: zone?.id ?? null, shipping_zone_name: zone?.name_ar ?? "تحدد بعد المراجعة",
      shipping_fee: shippingFee, items: lines, subtotal: finalSubtotal, total: finalTotal,
      status: "received", payment_terms: null,
    } });
    return NextResponse.json({ ok: true, orderId, total: finalTotal, quoteRequired: finalTotal === null }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save order";
    console.error("Order submission failed", message);
    return NextResponse.json({ error: message }, { status: /Invalid|Enter|Select|Quantity|available|minimum|area|product/i.test(message) ? 400 : 503 });
  }
}
