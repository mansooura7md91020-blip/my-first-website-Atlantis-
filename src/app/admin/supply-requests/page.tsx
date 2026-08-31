import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { demoSupplyRequests } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";

const statusTone: Record<string, "neutral" | "success" | "accent" | "danger"> = {
  new: "accent",
  reviewing: "accent",
  quoted: "neutral",
  accepted: "success",
  declined: "danger",
};

export default function AdminSupplyRequestsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Supply Requests"
        description="Bulk / institutional requests submitted from the public 'Request Supply Quote' form. Review and turn into a quotation."
      />

      <div className="space-y-4">
        {demoSupplyRequests.map((req) => (
          <div key={req.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-text">
                  {req.organizationName}{" "}
                  <span className="font-normal text-text-muted">— {req.organizationType.en}</span>
                </p>
                <p className="text-xs text-text-muted">
                  {req.id} · {req.customerName} · {req.phone}
                </p>
              </div>
              <StatusPill tone={statusTone[req.status]}>{req.status}</StatusPill>
            </div>

            <ul className="mt-3 space-y-1 text-sm text-text-muted">
              {req.items.map((item, i) => (
                <li key={i}>
                  • {item.productName} — {item.quantity} {item.unit}
                </li>
              ))}
            </ul>

            <div className="mt-3 grid gap-1 text-xs text-text-muted sm:grid-cols-2">
              <p>Delivery location: {req.deliveryLocation}</p>
              {req.requestedDeliveryDate && <p>Requested date: {req.requestedDeliveryDate}</p>}
            </div>
            {req.notes && <p className="mt-2 text-xs italic text-text-muted">"{req.notes}"</p>}

            <div className="mt-4 flex gap-2">
              <Button size="sm">Create quotation</Button>
              <Button size="sm" variant="outline">
                Mark reviewing
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
