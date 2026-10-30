import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/supabase/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", httpOnly: true, maxAge: 0, sameSite: "lax" });
  return response;
}
