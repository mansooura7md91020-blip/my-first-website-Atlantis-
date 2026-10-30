import { dbRequest, supabaseConfig } from "@/lib/supabase/rest";
/** A deliberate publish switch prevents the public site going blank during catalog migration. */
export async function catalogIsLive(): Promise<boolean> {
  if (!supabaseConfig()) return false;
  try {
    const rows = await dbRequest("company_settings?select=catalog_live&id=eq.1&limit=1");
    return Array.isArray(rows) && rows[0]?.catalog_live === true;
  } catch (error) {
    console.error("Catalog publish state unavailable; keeping labeled DEMO items", error);
    return false;
  }
}
