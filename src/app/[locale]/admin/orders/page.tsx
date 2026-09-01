import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { demoOrders } from "@/lib/data/admin";
import { products } from "@/lib/data/products";
import { resolvePrice, formatEGP } from "@/lib/utils/pricing";

const statusTone: Record<string, "neutral" | "success" | "accent" | "danger"> = {
  received: "neutral",
  confirmed: "accent",
  preparing: "accent",
  out_for_delivery: "accent",
  delivered: "success",
  cancelled: "danger",
};

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  return (
    <div>
      <AdminPageHeader title={t("admin.orders.title")} description={t("admin.orders.description")} />

      <AdminTable
        columns={[
          t("admin.orders.columnOrder"),
          t("admin.orders.columnCustomer"),
          t("admin.orders.columnTotal"),
          t("admin.orders.columnPaymentTerms"),
          t("admin.orders.columnStatus"),
        ]}
      >
        {demoOrders.map((order) => {
          const total = order.lines.reduce((sum, line) => {
            const product = products.find((p) => p.id === line.productId);
            if (!product) return sum;
            const price = resolvePrice(product.priceTiers, line.quantity);
            return sum + (price.lineTotal ?? 0);
          }, 0);
          return (
            <tr key={order.id}>
              <td className="px-4 py-3 font-medium text-text">{order.id}</td>
              <td className="px-4 py-3 text-text-muted">{order.customerName}</td>
              <td className="tabular px-4 py-3 text-text-muted">{formatEGP(total, locale)}</td>
              <td className="px-4 py-3 text-text-muted">{order.paymentTerms ?? t("admin.orders.notYetAgreed")}</td>
              <td className="px-4 py-3">
                <StatusPill tone={statusTone[order.status]}>{t(`admin.orders.status.${order.status}`)}</StatusPill>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
