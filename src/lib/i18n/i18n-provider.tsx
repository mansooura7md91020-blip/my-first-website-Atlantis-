"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary } from "./config";
import { Locale } from "@/lib/types";

interface I18nContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  dict: Dictionary;
  /** Dot-path translation lookup with optional {placeholder} interpolation. */
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(dict: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    const t = (key: string, vars?: Record<string, string | number>) => {
      const raw = lookup(dict as unknown as Record<string, unknown>, key);
      if (!vars) return raw;
      return Object.entries(vars).reduce(
        (text, [k, v]) => text.replaceAll(`{${k}}`, String(v)),
        raw
      );
    };
    return { locale, dir, dict, t };
  }, [locale, dict]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
