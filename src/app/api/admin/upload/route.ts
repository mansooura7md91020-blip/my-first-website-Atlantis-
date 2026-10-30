import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError } from "@/lib/supabase/route-helpers";
import { supabaseConfig } from "@/lib/supabase/rest";

export async function POST(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  const config = supabaseConfig();
  if (!config) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Select an image file.");
    const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
    const extension = types[file.type];
    if (!extension || file.size < 1 || file.size > 4 * 1024 * 1024) throw new Error("Upload JPEG, PNG, WEBP, or GIF images up to 4 MB.");
    const filename = `${crypto.randomUUID()}.${extension}`;
    const result = await fetch(`${config.url}/storage/v1/object/product-images/${filename}`, {
      method: "POST",
      headers: { apikey: config.key, Authorization: `Bearer ${token}`, "Content-Type": file.type, "x-upsert": "false" },
      body: await file.arrayBuffer(), cache: "no-store",
    });
    if (!result.ok) throw new Error(`Image upload failed: ${(await result.text()).slice(0, 400)}`);
    return NextResponse.json({ url: `${config.url}/storage/v1/object/public/product-images/${filename}` });
  } catch (e) { return apiError(e); }
}
