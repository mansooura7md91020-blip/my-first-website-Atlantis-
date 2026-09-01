import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, StatCard, StatusPill } from "@/components/admin/admin-ui";
import { demoOrders, demoSupplyRequests } from "@/lib/data/admin";
import { products } from "@/lib/data/products";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  const pendingSupplyRequests = demoSupplyRequests.filter((r) => r.status === "new" || r.status === "reviewing");
  const lowStock = products.filter((p) => p.inStock && (p.stockQty ?? 0) < 50);

  return (
    <div>
      <AdminPageHeader title={t("admin.dashboard.title")} description={t("admin.dashboard.description")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.dashboard.statOrders")} value={String(demoOrders.length)} hint={t("admin.dashboard.lastSevenDays")} />
        <StatCard label={t("admin.dashboard.statPendingRequests")} value={String(pendingSupplyRequests.length)} />
        <StatCard
          label={t("admin.dashboard.statProducts")}
          value={String(products.length)}
          hint={t("admin.dashboard.lowStockHint", { count: lowStock.length })}
        />
        <StatCard label={t("admin.dashboard.statOutOfStock")} value={String(products.filter((p) => !p.inStock).length)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-text">{t("admin.dashboard.recentOrders")}</h2>
            <Link href={`/${locale}/admin/orders`} className="text-xs font-medium text-brand">
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>
          <div className="divide-y divide-border">
            {demoOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{order.id}</p>
                  <p className="text-xs text-text-muted">{order.customerName}</p>
                </div>
                <StatusPill tone={order.status === "delivered" ? "success" : "accent"}>
                  {t(`admin.orders.status.${order.status}`)}
                </StatusPill>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-text">{t("admin.dashboard.supplyRequestsNeedingReview")}</h2>
            <Link href={`/${locale}/admin/supply-requests`} className="text-xs font-medium text-brand">
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pendingSupplyRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{req.organizationName}</p>
                  <p className="text-xs text-text-muted">
                    {req.id} · {req.items.length} {t("admin.supplyRequests.itemsLabel")}
                  </p>
                </div>
                <StatusPill tone={req.status === "new" ? "accent" : "neutral"}>
                  {t(`admin.supplyRequests.status.${req.status}`)}
                </StatusPill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
