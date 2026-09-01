"use client";

import { useMemo, useState } from "react";
import { Category, Locale, Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils/cn";

export function ProductsBrowser({
  products,
  categories,
  locale,
}: {
  products: Product[];
  categories: Category[];
  locale: Locale;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !categoryId || p.categoryId === categoryId;
      const matchesQuery =
        !query ||
        p.name[locale].toLowerCase().includes(query.toLowerCase()) ||
        p.name.ar.includes(query) ||
        p.name.en.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, categoryId, query, locale]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("common.search")}
          className="w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand sm:w-72"
        />
        <div className="flex flex-wrap gap-2">
          <FilterChip active={categoryId === null} onClick={() => setCategoryId(null)}>
            {t("products.allCategories")}
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.id} active={categoryId === c.id} onClick={() => setCategoryId(c.id)}>
              {c.name[locale]}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-text-muted">{t("products.noResults")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active ? "border-brand bg-brand text-white" : "border-border text-text-muted hover:text-text"
      )}
    >
      {children}
    </button>
  );
}
