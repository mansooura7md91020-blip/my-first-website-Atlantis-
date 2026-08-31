import { AdminPageHeader, AdminTable, StatusPill } from "@/components/admin/admin-ui";
import { demoCustomers } from "@/lib/data/admin";

export default function AdminCustomersPage() {
  return (
    <div>
      <AdminPageHeader title="Customers" description="Individuals and business accounts that have ordered or requested quotes." />

      <AdminTable columns={["Name", "Organization", "Phone", "Email", "Account type"]}>
        {demoCustomers.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3 font-medium text-text">{c.name}</td>
            <td className="px-4 py-3 text-text-muted">{c.organizationName ?? "—"}</td>
            <td className="px-4 py-3 text-text-muted">{c.phone}</td>
            <td className="px-4 py-3 text-text-muted">{c.email ?? "—"}</td>
            <td className="px-4 py-3">
              <StatusPill tone={c.isBusinessAccount ? "accent" : "neutral"}>
                {c.isBusinessAccount ? "Business" : "Individual"}
              </StatusPill>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
