import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { getProductBySlug, getProductsByCategory } from "@/lib/data/products";
import { getCategoryBySlug, getCategories } from "@/lib/data/categories";
import { useI18nServer } from "@/lib/i18n/server-t";
import { Container, Badge } from "@/components/ui/primitives";
import { PriceTiers } from "@/components/products/price-tiers";
import { AddToCartForm } from "@/components/products/add-to-cart-form";
import { ProductCard } from "@/components/products/product-card";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const { t } = await useI18nServer(locale);
  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  const related = (await getProductsByCategory(product.categoryId)).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <Container className="py-10 sm:py-14">
      <nav className="mb-6 text-sm text-text-muted">
        <Link href={`/${locale}/products`} className="hover:text-text">
          {t("products.title")}
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/${locale}/categories/${category.slug}`} className="hover:text-text">
              {category.name[locale]}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted">
          <Image src={product.images[0]} alt={product.name[locale]} fill className="object-contain p-12" />
          {product.isDemo && (
            <Badge tone="accent" className="absolute top-3 start-3">
              DEMO
            </Badge>
          )}
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{product.name[locale]}</h1>
          <p className="mt-2 text-text-muted">{product.shortDescription[locale]}</p>

          <div className="mt-6 flex items-center gap-2">
            <Badge tone={product.inStock ? "success" : "danger"}>
              {product.inStock ? t("common.inStock") : t("common.outOfStock")}
            </Badge>
          </div>

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
              {t("products.bulkPricingTitle")}
            </h2>
            <PriceTiers tiers={product.priceTiers} unit={product.unit} locale={locale} />
          </div>
        </div>
      </div>

      <div className="mt-14 max-w-3xl">
        <h2 className="mb-3 text-lg font-semibold text-text">{t("products.descriptionTitle")}</h2>
        <p className="leading-relaxed text-text-muted">{product.description[locale]}</p>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-lg font-semibold text-text">{t("products.relatedTitle")}</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
