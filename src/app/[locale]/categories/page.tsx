import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Locale } from "@/lib/types";
import { getCategories } from "@/lib/data/categories";
import { useI18nServer } from "@/lib/i18n/server-t";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { CategoryCard } from "@/components/products/category-card";

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { t } = await useI18nServer(locale);
  const categories = await getCategories();

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("categories.title")} />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} locale={locale} />
        ))}
      </div>
    </Container>
  );
}
