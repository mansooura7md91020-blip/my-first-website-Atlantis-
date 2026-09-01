import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, StatusPill } from "@/components/admin/admin-ui";
import { demoSupplyRequests } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";

const statusTone: Record<string, "neutral" | "success" | "accent" | "danger"> = {
  new: "accent",
  reviewing: "accent",
  quoted: "neutral",
  accepted: "success",
  declined: "danger",
};

export default async function AdminSupplyRequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  return (
    <div>
      <AdminPageHeader title={t("admin.supplyRequests.title")} description={t("admin.supplyRequests.description")} />

      <div className="space-y-4">
        {demoSupplyRequests.map((req) => (
          <div key={req.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-text">
                  {req.organizationName}{" "}
                  <span className="font-normal text-text-muted">— {req.organizationType[locale]}</span>
                </p>
                <p className="text-xs text-text-muted">
                  {req.id} · {req.customerName} · {req.phone}
                </p>
              </div>
              <StatusPill tone={statusTone[req.status]}>{t(`admin.supplyRequests.status.${req.status}`)}</StatusPill>
            </div>

            <ul className="mt-3 space-y-1 text-sm text-text-muted">
              {req.items.map((item, i) => (
                <li key={i}>
                  • {item.productName} — {item.quantity} {t(`units.${item.unit}`)}
                </li>
              ))}
            </ul>

            <div className="mt-3 grid gap-1 text-xs text-text-muted sm:grid-cols-2">
              <p>
                {t("admin.supplyRequests.deliveryLocation")}: {req.deliveryLocation}
              </p>
              {req.requestedDeliveryDate && (
                <p>
                  {t("admin.supplyRequests.requestedDate")}: {req.requestedDeliveryDate}
                </p>
              )}
            </div>
            {req.notes && <p className="mt-2 text-xs italic text-text-muted">"{req.notes}"</p>}

            <div className="mt-4 flex gap-2">
              <Button size="sm">{t("admin.supplyRequests.createQuotation")}</Button>
              <Button size="sm" variant="outline">
                {t("admin.supplyRequests.markReviewing")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
