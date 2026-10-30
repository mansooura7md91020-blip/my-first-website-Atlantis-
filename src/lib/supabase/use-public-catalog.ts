"use client";
import { useEffect, useState } from "react";
import { Category, CompanySettings, Product } from "@/lib/types";
export function usePublicCatalog() {
  const [data, setData] = useState<{ products: Product[]; categories: Category[]; settings: CompanySettings } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/catalog", { cache: "no-store" }).then(async r => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "Catalog unavailable");
      setData(body);
    }).catch(e => setError(e.message));
  }, []);
  return { data, error, loading: !data && !error };
}
