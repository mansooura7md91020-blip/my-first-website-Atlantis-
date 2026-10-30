import Link from "next/link";
import { getAdminToken } from "@/lib/supabase/auth";
import { dbRequest } from "@/lib/supabase/rest";
import { AdminPageHeader, StatCard } from "@/components/admin/admin-ui";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const ar = raw === "ar";
  const token = await getAdminToken();
  let countProducts = 0, countOrders = 0, countSupply = 0, countZones = 0;
  let setupError = "";
  try {
    if (!token) throw new Error("Please sign in as an administrator");
    const [products, orders, requests, zones] = await Promise.all([
      dbRequest("products?select=id,in_stock", { token }),
      dbRequest("orders?select=id,status&order=created_at.desc&limit=250", { token }),
      dbRequest("supply_requests?select=id,status&order=created_at.desc&limit=250", { token }),
      dbRequest("shipping_zones?select=id", { token }),
    ]);
    countProducts = products.length; countOrders = orders.length;
    countSupply = requests.filter((r: {status:string}) => r.status === "new" || r.status === "reviewing").length;
    countZones = zones.length;
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Database unavailable";
  }
  return <section className="space-y-6">
    <AdminPageHeader title={ar ? "لوحة تحكم أطلنتس" : "Atlantis admin dashboard"} description={ar ? "إدارة المنتجات والشحن والطلبات والإعدادات من قاعدة البيانات" : "Manage catalog, delivery, requests and settings in Supabase"}/>
    {setupError && <p role="alert" className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">{ar ? "اللوحة لم تستطع قراءة بعض الجداول. نفّذ ملف SUPABASE_STEP2.sql في Supabase قبل الاعتماد على البيانات." : "Some tables are missing or not accessible. Run SUPABASE_STEP2.sql in Supabase."} <span dir="ltr">{setupError}</span></p>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label={ar ? "المنتجات في قاعدة البيانات" : "Database products"} value={setupError ? "—" : String(countProducts)} />
      <StatCard label={ar ? "الطلبات المحفوظة (آخر 250)" : "Saved orders (last 250)"} value={setupError ? "—" : String(countOrders)} />
      <StatCard label={ar ? "طلبات توريد جديدة / تحت المراجعة" : "Supply requests needing review"} value={setupError ? "—" : String(countSupply)} />
      <StatCard label={ar ? "مناطق الشحن" : "Shipping zones"} value={setupError ? "—" : String(countZones)} />
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[
        ["products",ar ? "إدارة المنتجات والأسعار" : "Products & pricing"],
        ["categories",ar ? "إدارة الأقسام" : "Categories"],
        ["shipping",ar ? "مناطق وأسعار الشحن" : "Shipping fees"],
        ["orders",ar ? "طلبات العملاء" : "Orders"],
        ["supply-requests",ar ? "طلبات التوريد" : "Supply requests"],
        ["quotations",ar ? "عروض أسعار التوريد" : "Quotations"],
        ["customers",ar ? "بيانات العملاء" : "Customers"],
        ["settings",ar ? "اللوجو وبيانات التواصل" : "Brand & contact settings"],
      ].map(([href,label])=><Link key={href} href={`/${raw}/admin/${href}`} className="rounded-xl border border-border bg-surface p-5 font-medium text-text hover:border-brand">{label}</Link>)}
    </div>
    <p className="text-sm text-text-muted">{ar ? "مهم: المنتجات التجريبية القديمة ستظل ظاهرة للزوار وموسومة DEMO لحد ما تضيف أول منتج حقيقي في Supabase. لا تعتبر أسعار DEMO أسعار بيع نهائية." : "Demo products remain visible and labelled until you publish real products in Supabase."}</p>
  </section>;
}
