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

export default function AdminOrdersPage() {
  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Normal shopping orders placed through the website. Payment terms are set per order, never a fixed policy."
      />

      <AdminTable columns={["Order", "Customer", "Total (EGP)", "Payment terms", "Status"]}>
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
              <td className="tabular px-4 py-3 text-text-muted">{formatEGP(total, "en")}</td>
              <td className="px-4 py-3 text-text-muted">{order.paymentTerms ?? "Not yet agreed"}</td>
              <td className="px-4 py-3">
                <StatusPill tone={statusTone[order.status]}>{order.status.replaceAll("_", " ")}</StatusPill>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
