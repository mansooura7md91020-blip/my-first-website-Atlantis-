import Image from "next/image";
import { AdminPageHeader, AdminTable } from "@/components/admin/admin-ui";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { Button } from "@/components/ui/button";

export default function AdminCategoriesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Organize the catalog into browsable sections."
        action={<Button size="sm">Add category</Button>}
      />

      <AdminTable columns={["Category", "Slug", "Products", "Sectors"]}>
        {categories.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  <Image src={c.image} alt="" fill className="object-contain p-1" />
                </div>
                <span className="font-medium text-text">{c.name.en}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-text-muted">{c.slug}</td>
            <td className="tabular px-4 py-3 text-text-muted">
              {products.filter((p) => p.categoryId === c.id).length}
            </td>
            <td className="px-4 py-3 text-text-muted">{c.sectors.map((s) => s.en).join(", ")}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
