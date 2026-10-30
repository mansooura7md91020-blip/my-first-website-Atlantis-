import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/supabase/auth";
import { dbRequest, supabaseConfig } from "@/lib/supabase/rest";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const config = supabaseConfig();
  if (!config) return NextResponse.json({ error: "Supabase connection is not configured." }, { status: 503 });
  const payload = await request.json().catch(() => null);
  const email = typeof payload?.email === "string" ? payload.email.trim().slice(0, 254) : "";
  const password = typeof payload?.password === "string" ? payload.password : "";
  if (!email || !password || password.length > 1024) return NextResponse.json({ error: "Enter email and password." }, { status: 400 });
  try {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: config.key, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    const session = await response.json();
    if (typeof session?.access_token !== "string" || !session?.user?.id) throw new Error("Bad session");
    const adminRows = await dbRequest(`admin_users?select=user_id&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`, { token: session.access_token });
    if (!Array.isArray(adminRows) || adminRows.length !== 1) return NextResponse.json({ error: "This account is not an Atlantis administrator." }, { status: 403 });
    const expires = Math.max(60, Math.min(Number(session.expires_in) || 3600, 3600));
    const result = NextResponse.json({ ok: true });
    result.cookies.set(ADMIN_COOKIE, session.access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: expires,
    });
    return result;
  } catch {
    return NextResponse.json({ error: "Login is unavailable. Check your Supabase connection." }, { status: 502 });
  }
}
