import { Locale } from "@/lib/types";
import { getDictionary } from "./config";

function lookup(dict: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

/** Use in server components/pages that need translations without client interactivity. */
export async function useI18nServer(locale: Locale) {
  const dict = await getDictionary(locale);
  const t = (key: string, vars?: Record<string, string | number>) => {
    const raw = lookup(dict as unknown as Record<string, unknown>, key);
    if (!vars) return raw;
    return Object.entries(vars).reduce((text, [k, v]) => text.replaceAll(`{${k}}`, String(v)), raw);
  };
  return { t, dict };
}
