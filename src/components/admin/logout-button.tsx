"use client";
export function LogoutButton({ locale }: { locale: string }) {
  return <button type="button" className="text-xs font-medium text-text-muted hover:underline" onClick={async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign(`/${locale}/staff-login`);
  }}>{locale === "ar" ? "تسجيل الخروج" : "Sign out"}</button>;
}
