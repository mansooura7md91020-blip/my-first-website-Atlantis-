import { NextRequest, NextResponse } from "next/server";
import { adminApiToken, apiError, jsonInput, validUuid } from "@/lib/supabase/route-helpers";
import { dbRequest } from "@/lib/supabase/rest";
import { validateCategory } from "@/lib/supabase/validators";

export async function POST(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try {
    const data = validateCategory(await jsonInput(request));
    const created = await dbRequest("categories", { method: "POST", body: data, token, extraHeaders: { Prefer: "return=representation" } });
    return NextResponse.json({ row: created?.[0] }, { status: 201 });
  } catch (e) { return apiError(e); }
}
export async function PATCH(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try {
    const input = await jsonInput(request);
    if (!validUuid(input.id)) throw new Error("Invalid category id");
    const data = validateCategory(input);
    const updated = await dbRequest(`categories?id=eq.${input.id}`, { method: "PATCH", body: data, token, extraHeaders: { Prefer: "return=representation" } });
    if (!updated?.length) return NextResponse.json({ error: "Category was not found." }, { status: 404 });
    return NextResponse.json({ row: updated[0] });
  } catch (e) { return apiError(e); }
}
export async function DELETE(request: NextRequest) {
  const token = await adminApiToken(request); if (typeof token !== "string") return token;
  try {
    const input = await jsonInput(request);
    if (!validUuid(input.id)) throw new Error("Invalid category id");
    await dbRequest(`categories?id=eq.${input.id}`, { method: "DELETE", token });
    return NextResponse.json({ ok: true });
  } catch (e) { return apiError(e); }
}
