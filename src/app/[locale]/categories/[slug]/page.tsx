import { notFound } from "next/navigation";
import Image from "next/image";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { useI18nServer } from "@/lib/i18n/server-t";
import { Container } from "@/components/ui/primitives";
import { ProductCard } from "@/components/products/product-card";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { t } = await useI18nServer(locale);
  const products = await getProductsByCategory(category.id);

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
          <Image src={category.image} alt={category.name[locale]} fill className="object-contain p-3" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">{category.name[locale]}</h1>
          <p className="mt-1 text-text-muted">{category.description[locale]}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.sectors.map((s, i) => (
              <span key={i} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-text-muted">
                {t("categories.suppliesFor")}: {s[locale]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-text-muted">{t("products.noResults")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </Container>
  );
}
