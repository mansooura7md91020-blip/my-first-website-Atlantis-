"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Locale } from "@/lib/types";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useI18n();

  function switchTo(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next; // [locale] is always the first path segment
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <div className="flex items-center rounded-full border border-border p-0.5 text-xs font-medium">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={locale === l}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === l ? "bg-brand text-white" : "text-text-muted hover:text-text"
          }`}
        >
          {l === "ar" ? "عربي" : "EN"}
        </button>
      ))}
    </div>
  );
}
