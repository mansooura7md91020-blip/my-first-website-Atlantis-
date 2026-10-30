"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container } from "@/components/ui/primitives";

export default function StaffLoginPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function login(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      window.location.assign(`/${locale}/admin`);
    } catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setLoading(false); }
  }
  return <Container className="py-16">
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-7 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-text">{ar ? "دخول مدير الموقع" : "Atlantis admin login"}</h1>
      <p className="mb-6 text-sm text-text-muted">{ar ? "استخدم حساب المدير الذي أنشأته في Supabase." : "Sign in with your Supabase administrator account."}</p>
      <form onSubmit={login} className="space-y-4">
        <label className="block text-sm text-text">{ar ? "البريد الإلكتروني" : "Email"}<input required type="email" autoComplete="username" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg p-3" /></label>
        <label className="block text-sm text-text">{ar ? "كلمة المرور" : "Password"}<input required type="password" autoComplete="current-password" dir="ltr" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg p-3" /></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} type="submit" className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-white disabled:opacity-60">{loading ? (ar ? "جاري الدخول..." : "Signing in...") : (ar ? "تسجيل الدخول" : "Sign in")}</button>
      </form>
    </div>
  </Container>;
}
