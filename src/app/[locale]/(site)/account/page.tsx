"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container } from "@/components/ui/primitives";
import { demoOrders } from "@/lib/data/admin";
import { Badge } from "@/components/ui/primitives";

const statusTone: Record<string, "neutral" | "success" | "accent" | "danger"> = {
  received: "neutral",
  confirmed: "accent",
  preparing: "accent",
  out_for_delivery: "accent",
  delivered: "success",
  cancelled: "danger",
};

export default function AccountPage() {
  const { t, locale } = useI18n();

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-2xl font-bold text-text">{t("account.title")}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("account.profileTitle")}
          </h2>
          <p className="text-sm text-text-muted">{t("auth.comingSoonNotice")}</p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("account.ordersTitle")}
          </h2>
          <div className="divide-y divide-border rounded-xl border border-border bg-surface">
            {demoOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{order.id}</p>
                  <p dir="ltr" className="text-end text-xs text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-EG")}
                  </p>
                </div>
                <Badge tone={statusTone[order.status]}>{order.status.replaceAll("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
