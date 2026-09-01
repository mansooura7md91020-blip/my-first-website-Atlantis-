import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, AdminTable } from "@/components/admin/admin-ui";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { Button } from "@/components/ui/button";

export default async function AdminCategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  return (
    <div>
      <AdminPageHeader
        title={t("admin.categories.title")}
        description={t("admin.categories.description")}
        action={<Button size="sm">{t("admin.categories.addCategory")}</Button>}
      />

      <AdminTable
        columns={[
          t("admin.categories.columnCategory"),
          t("admin.categories.columnSlug"),
          t("admin.categories.columnProducts"),
          t("admin.categories.columnSectors"),
        ]}
      >
        {categories.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  <Image src={c.image} alt="" fill className="object-contain p-1" />
                </div>
                <span className="font-medium text-text">{c.name[locale]}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-text-muted">{c.slug}</td>
            <td className="tabular px-4 py-3 text-text-muted">
              {products.filter((p) => p.categoryId === c.id).length}
            </td>
            <td className="px-4 py-3 text-text-muted">{c.sectors.map((s) => s[locale]).join(", ")}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
