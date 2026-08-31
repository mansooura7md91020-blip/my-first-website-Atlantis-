import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { demoQuotations } from "@/lib/data/admin";
import { formatEGP } from "@/lib/utils/pricing";

const statusTone: Record<string, "neutral" | "success" | "accent" | "danger"> = {
  draft: "neutral",
  sent: "accent",
  accepted: "success",
  rejected: "danger",
};

export default function AdminQuotationsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Quotations"
        description="Each quotation carries its own payment and delivery terms, agreed with the customer — there is no site-wide default credit period."
      />

      <div className="space-y-4">
        {demoQuotations.map((q) => {
          const total = q.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
          return (
            <div key={q.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{q.id}</p>
                  <p className="text-xs text-text-muted">
                    For request {q.supplyRequestId} · Valid until {q.validUntil}
                  </p>
                </div>
                <StatusPill tone={statusTone[q.status]}>{q.status}</StatusPill>
              </div>

              <AdminTable columns={["Item", "Qty", "Unit price", "Line total"]}>
                {q.lines.map((line, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-text">{line.description}</td>
                    <td className="tabular px-4 py-2.5 text-text-muted">
                      {line.quantity} {line.unit}
                    </td>
                    <td className="tabular px-4 py-2.5 text-text-muted">EGP {formatEGP(line.unitPrice, "en")}</td>
                    <td className="tabular px-4 py-2.5 font-medium text-text">
                      EGP {formatEGP(line.unitPrice * line.quantity, "en")}
                    </td>
                  </tr>
                ))}
              </AdminTable>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-surface-muted p-3 text-sm">
                  <p className="text-xs font-medium uppercase text-text-muted">Payment terms (this quotation)</p>
                  <p className="mt-1 text-text">{q.paymentTerms}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-3 text-sm">
                  <p className="text-xs font-medium uppercase text-text-muted">Delivery terms</p>
                  <p className="mt-1 text-text">{q.deliveryTerms ?? "—"}</p>
                </div>
              </div>

              <p className="tabular mt-3 text-end text-sm font-semibold text-brand-strong">
                Total: EGP {formatEGP(total, "en")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
