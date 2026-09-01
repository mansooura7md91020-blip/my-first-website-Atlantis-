"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useCart } from "@/lib/context/cart-context";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Header({ companyNameAr, brandName }: { companyNameAr: string; brandName: string }) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/products`, label: t("nav.products") },
    { href: `/${locale}/categories`, label: t("nav.categories") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} aria-label={brandName}>
          <Logo companyNameAr={companyNameAr} brandName={brandName} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-sm font-medium text-text-muted transition-colors hover:text-text",
                pathname === link.href && "text-brand-strong font-semibold"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute inset-x-0 -bottom-[15px] h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <LinkButton
            href={`/${locale}/supply-request`}
            variant="accent"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t("nav.supplyRequest")}
          </LinkButton>

          <Link
            href={`/${locale}/cart`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text"
            aria-label={t("nav.cart")}
          >
            <CartIcon className="h-4.5 w-4.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -end-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />

          <Link
            href={`/${locale}/login`}
            className="hidden rounded-full border border-border p-2 text-text-muted transition-colors hover:border-border-strong hover:text-text lg:flex"
            aria-label={t("nav.login")}
          >
            <UserIcon className="h-4 w-4" />
          </Link>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <MenuIcon className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium text-text transition-colors",
                  pathname === link.href ? "bg-brand-soft text-brand-strong" : "hover:bg-surface-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/supply-request`}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              {t("nav.supplyRequest")}
            </Link>
            <Link
              href={`/${locale}/login`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted"
            >
              {t("nav.login")}
            </Link>
            <div className="mt-1 flex items-center justify-between px-3 pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h8a2 2 0 0 0 2-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c1.5-4 5-5.5 7-5.5S18.5 16 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
