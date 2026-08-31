import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import { LogoMark } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: { default: "Admin · Atlantis", template: "%s · Atlantis Admin" },
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/products", label: "Products", icon: "box" },
  { href: "/admin/categories", label: "Categories", icon: "layers" },
  { href: "/admin/orders", label: "Orders", icon: "cart" },
  { href: "/admin/supply-requests", label: "Supply Requests", icon: "inbox" },
  { href: "/admin/quotations", label: "Quotations", icon: "doc" },
  { href: "/admin/customers", label: "Customers", icon: "users" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-bg font-body text-text antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar — collapses to a bottom/top bar pattern is out of scope for v1,
              but the layout below already reflows to a single column on mobile. */}
          <aside className="hidden w-64 shrink-0 border-e border-border bg-surface lg:block">
            <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
              <LogoMark />
              <div className="leading-none">
                <p className="font-display text-sm font-bold text-text">ATLANTIS</p>
                <p className="text-[11px] text-text-muted">Admin Dashboard</p>
              </div>
            </div>
            <nav className="space-y-0.5 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
                >
                  <AdminIcon name={item.icon} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="m-3 rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-text-muted">
              This is a UI preview. Data shown is demo data — connect Supabase to make it live.
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className="font-display text-sm font-bold text-text">Admin</span>
              </div>
              <Link href="/" className="text-xs font-medium text-brand">
                View site
              </Link>
            </header>

            {/* Mobile bottom-scrollable nav so the dashboard is usable on phones */}
            <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

function AdminIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    box: "M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10",
    layers: "M12 3 2 8l10 5 10-5-10-5ZM4 12l8 4 8-4M4 16l8 4 8-4",
    cart: "M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h8a2 2 0 0 0 2-1.6L20 8H6",
    inbox: "M4 4h16v10l-3 6H7l-3-6V4Zm0 10h5l2 3h2l2-3h5",
    doc: "M6 3h9l3 3v15H6zM15 3v3h3M9 12h6M9 16h6",
    users: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 9c1-3.5 3.5-5 6-5s5 1.5 6 5M17 11a3 3 0 1 0 0-6M17 20c-.3-1-1-2.4-2-3.3",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4a7.9 7.9 0 0 0-.2-1.8l2-1.5-2-3.5-2.4 1a8 8 0 0 0-3.1-1.8L14 2h-4l-.3 2.4a8 8 0 0 0-3.1 1.8l-2.4-1-2 3.5 2 1.5A7.9 7.9 0 0 0 4 12c0 .6.1 1.2.2 1.8l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 3.1 1.8L10 22h4l.3-2.4a8 8 0 0 0 3.1-1.8l2.4 1 2-3.5-2-1.5c.1-.6.2-1.2.2-1.8Z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 shrink-0">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
