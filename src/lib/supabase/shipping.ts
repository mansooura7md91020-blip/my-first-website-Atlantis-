import { dbRequest, supabaseConfig } from "./rest";

export type ShippingZone = {
  id: string; name_ar: string; name_en: string; fee: number | null;
  quote_only: boolean; is_active: boolean; sort_order: number;
};

export async function getShippingZones(token?: string): Promise<ShippingZone[]> {
  if (!supabaseConfig()) return [];
  const query = token ? "shipping_zones?select=*&order=sort_order.asc,name_ar.asc" : "shipping_zones?select=*&is_active=eq.true&order=sort_order.asc,name_ar.asc";
  return (await dbRequest(query, { token })) as ShippingZone[];
}
