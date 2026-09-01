import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { getStartingPrice, formatEGP } from "@/lib/utils/pricing";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  return (
    <div>
      <AdminPageHeader
        title={t("admin.products.title")}
        description={t("admin.products.description")}
        action={<Button size="sm">{t("admin.products.addProduct")}</Button>}
      />

      <AdminTable
        columns={[
          t("admin.products.columnProduct"),
          t("admin.products.columnCategory"),
          t("admin.products.columnUnit"),
          t("admin.products.columnFrom"),
          t("admin.products.columnStock"),
          t("admin.products.columnStatus"),
        ]}
      >
        {products.map((p) => {
          const category = categories.find((c) => c.id === p.categoryId);
          const startingPrice = getStartingPrice(p);
          return (
            <tr key={p.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    <Image src={p.images[0]} alt="" fill className="object-contain p-1" />
                  </div>
                  <span className="font-medium text-text">{p.name[locale]}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-text-muted">{category?.name[locale]}</td>
              <td className="px-4 py-3 text-text-muted">{t(`units.${p.unit}`)}</td>
              <td className="tabular px-4 py-3 text-text-muted">
                {startingPrice !== null
                  ? `${t("admin.common.currency")} ${formatEGP(startingPrice, locale)}`
                  : t("admin.products.quoteOnly")}
              </td>
              <td className="tabular px-4 py-3 text-text-muted">{p.stockQty ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusPill tone={p.inStock ? "success" : "danger"}>
                  {p.inStock ? t("admin.products.inStock") : t("admin.products.outOfStock")}
                </StatusPill>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
