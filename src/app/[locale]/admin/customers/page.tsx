import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { demoCustomers } from "@/lib/data/admin";

export default async function AdminCustomersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { t } = await useI18nServer(locale);

  return (
    <div>
      <AdminPageHeader title={t("admin.customers.title")} description={t("admin.customers.description")} />

      <AdminTable
        columns={[
          t("admin.customers.columnName"),
          t("admin.customers.columnOrganization"),
          t("admin.customers.columnPhone"),
          t("admin.customers.columnEmail"),
          t("admin.customers.columnAccountType"),
        ]}
      >
        {demoCustomers.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3 font-medium text-text">{c.name}</td>
            <td className="px-4 py-3 text-text-muted">{c.organizationName ?? "—"}</td>
            <td className="px-4 py-3 text-text-muted">{c.phone}</td>
            <td className="px-4 py-3 text-text-muted">{c.email ?? "—"}</td>
            <td className="px-4 py-3">
              <StatusPill tone={c.isBusinessAccount ? "accent" : "neutral"}>
                {c.isBusinessAccount ? t("admin.customers.business") : t("admin.customers.individual")}
              </StatusPill>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
