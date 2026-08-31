import Link from "next/link";
import { AdminPageHeader, StatCard, StatusPill } from "@/components/admin/admin-ui";
import { demoOrders, demoSupplyRequests } from "@/lib/data/admin";
import { products } from "@/lib/data/products";

export default function AdminDashboardPage() {
  const pendingSupplyRequests = demoSupplyRequests.filter((r) => r.status === "new" || r.status === "reviewing");
  const lowStock = products.filter((p) => p.inStock && (p.stockQty ?? 0) < 50);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of store activity. All figures below are demo data."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orders (demo)" value={String(demoOrders.length)} hint="Last 7 days" />
        <StatCard label="Pending supply requests" value={String(pendingSupplyRequests.length)} />
        <StatCard label="Products" value={String(products.length)} hint={`${lowStock.length} low stock`} />
        <StatCard label="Out of stock" value={String(products.filter((p) => !p.inStock).length)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-text">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-brand">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {demoOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{order.id}</p>
                  <p className="text-xs text-text-muted">{order.customerName}</p>
                </div>
                <StatusPill tone={order.status === "delivered" ? "success" : "accent"}>{order.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-text">Supply requests needing review</h2>
            <Link href="/admin/supply-requests" className="text-xs font-medium text-brand">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pendingSupplyRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{req.organizationName}</p>
                  <p className="text-xs text-text-muted">{req.id} · {req.items.length} item(s)</p>
                </div>
                <StatusPill tone={req.status === "new" ? "accent" : "neutral"}>{req.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
