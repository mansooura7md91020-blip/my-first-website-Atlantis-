import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { demoQuotations } from "@/lib/data/admin";
import { formatEGP } from "@/lib/utils/pricing";

const statusTone: Record<string, "neutral" | "success" | "accent" | "danger"> = {
  draft: "neutral",
  sent: "accent",
  accepted: "success",
  rejected: "danger",
};

export default async function AdminQuotationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  return (
    <div>
      <AdminPageHeader title={t("admin.quotations.title")} description={t("admin.quotations.description")} />

      <div className="space-y-4">
        {demoQuotations.map((q) => {
          const total = q.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
          return (
            <div key={q.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{q.id}</p>
                  <p className="text-xs text-text-muted">
                    {t("admin.quotations.forRequest")} {q.supplyRequestId} · {t("admin.quotations.validUntil")} {q.validUntil}
                  </p>
                </div>
                <StatusPill tone={statusTone[q.status]}>{t(`admin.quotations.status.${q.status}`)}</StatusPill>
              </div>

              <AdminTable
                columns={[
                  t("admin.quotations.columnItem"),
                  t("admin.quotations.columnQty"),
                  t("admin.quotations.columnUnitPrice"),
                  t("admin.quotations.columnLineTotal"),
                ]}
              >
                {q.lines.map((line, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-text">{line.description}</td>
                    <td className="tabular px-4 py-2.5 text-text-muted">
                      {line.quantity} {t(`units.${line.unit}`)}
                    </td>
                    <td className="tabular px-4 py-2.5 text-text-muted">
                      {t("admin.common.currency")} {formatEGP(line.unitPrice, locale)}
                    </td>
                    <td className="tabular px-4 py-2.5 font-medium text-text">
                      {t("admin.common.currency")} {formatEGP(line.unitPrice * line.quantity, locale)}
                    </td>
                  </tr>
                ))}
              </AdminTable>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-surface-muted p-3 text-sm">
                  <p className="text-xs font-medium uppercase text-text-muted">{t("admin.quotations.paymentTermsLabel")}</p>
                  <p className="mt-1 text-text">{q.paymentTerms}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-3 text-sm">
                  <p className="text-xs font-medium uppercase text-text-muted">{t("admin.quotations.deliveryTermsLabel")}</p>
                  <p className="mt-1 text-text">{q.deliveryTerms ?? "—"}</p>
                </div>
              </div>

              <p className="tabular mt-3 text-end text-sm font-semibold text-brand-strong">
                {t("admin.quotations.total")}: {t("admin.common.currency")} {formatEGP(total, locale)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
