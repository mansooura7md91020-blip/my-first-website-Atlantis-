import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "./auth";

export async function adminApiToken(request: NextRequest): Promise<string | NextResponse> {
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    // Browser-originated mutations must be from our own site.
    if (!origin || origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Please sign in as an Atlantis administrator." }, { status: 401 });
  return token;
}
export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: /valid|invalid|required|tier|quantity|price/i.test(message) ? 400 : 500 });
}
export function validUuid(id: unknown): id is string {
  return typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
export async function jsonInput(request: NextRequest): Promise<Record<string, unknown>> {
  const input = await request.json();
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid input");
  return input;
}
