import Image from "next/image";
import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { getStartingPrice, formatEGP } from "@/lib/utils/pricing";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage the catalog, images, units and quantity price tiers."
        action={<Button size="sm">Add product</Button>}
      />

      <AdminTable columns={["Product", "Category", "Unit", "From", "Stock", "Status"]}>
        {products.map((p) => {
          const category = categories.find((c) => c.id === p.categoryId);
          const startingPrice = getStartingPrice(p);
          return (
            <tr key={p.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    <Image src={p.images[0]} alt="" fill className="object-contain p-1" />
                  </div>
                  <span className="font-medium text-text">{p.name.en}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-text-muted">{category?.name.en}</td>
              <td className="px-4 py-3 text-text-muted">{p.unit}</td>
              <td className="tabular px-4 py-3 text-text-muted">
                {startingPrice !== null ? `EGP ${formatEGP(startingPrice, "en")}` : "Quote only"}
              </td>
              <td className="tabular px-4 py-3 text-text-muted">{p.stockQty ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusPill tone={p.inStock ? "success" : "danger"}>
                  {p.inStock ? "In stock" : "Out of stock"}
                </StatusPill>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
