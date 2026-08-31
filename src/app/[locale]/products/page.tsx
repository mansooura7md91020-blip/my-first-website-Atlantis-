import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Locale } from "@/lib/types";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { useI18nServer } from "@/lib/i18n/server-t";
import { ProductsBrowser } from "./products-browser";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { t } = await useI18nServer(locale);
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("products.title")} subtitle={t("common.demoDataNotice")} />
      <div className="mt-8">
        <ProductsBrowser products={products} categories={categories} locale={locale} />
      </div>
    </Container>
  );
}
