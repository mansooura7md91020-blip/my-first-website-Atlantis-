"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/i18n-provider";
import type { DbCategory, DbProduct } from "@/lib/supabase/mappers";

const units = ["piece", "pack", "carton", "kg", "liter", "box", "roll"];
type CategoryForm = Pick<DbCategory, "slug" | "name_ar" | "name_en" | "description_ar" | "description_en" | "image_url" | "is_active"> & { id?: string };
type Tier = { minQty: number; maxQty: number | null; pricePerUnit: number | null };
type ProductForm = Pick<DbProduct, "slug" | "category_id" | "name_ar" | "name_en" | "description_ar" | "description_en" | "unit" | "min_order_qty" | "stock_qty" | "in_stock" | "is_active"> & { id?: string; image_urls: string[]; price_tiers: Tier[] };
const emptyCategory: CategoryForm = { slug: "", name_ar: "", name_en: "", description_ar: "", description_en: "", image_url: "", is_active: true };
const emptyProduct: ProductForm = { slug: "", category_id: "", name_ar: "", name_en: "", description_ar: "", description_en: "", unit: "piece", min_order_qty: 1, stock_qty: 0, in_stock: true, is_active: true, image_urls: [], price_tiers: [{ minQty: 1, maxQty: null, pricePerUnit: null }] };

type CatalogResponse = { categories: DbCategory[]; products: DbProduct[]; settings: unknown };
async function api(url: string, method = "GET", data?: unknown) {
  const response = await fetch(url, { method, headers: data !== undefined ? { "Content-Type": "application/json" } : undefined, body: data === undefined ? undefined : JSON.stringify(data), cache: "no-store" });
  const value = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(value.error || `Error ${response.status}`);
  return value;
}

function Input({ label, value, onChange, required = false, direction = "auto", type = "text", placeholder }: { label: string; value: string | number; onChange: (value: string) => void; required?: boolean; direction?: "auto" | "ltr" | "rtl"; type?: string; placeholder?: string }) {
  return <label className="block text-sm font-medium text-text">{label}
    <input type={type} step={type === "number" ? "any" : undefined} dir={direction} required={required} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg p-2.5 text-text" />
  </label>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />{label}</label>;
}
function ActionButton({ children, onClick, danger = false }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-sm ${danger ? "border-red-300 text-red-700" : "border-border text-text"}`}>{children}</button>;
}

export function CatalogManager({ mode }: { mode: "products" | "categories" }) {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState<CategoryForm>(emptyCategory);
  const [product, setProduct] = useState<ProductForm>(emptyProduct);
  async function reload() {
    const value = await api("/api/admin/catalog");
    setCatalog(value);
  }
  useEffect(() => { reload().catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  function setC<K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) { setCategory(prev => ({ ...prev, [key]: value })); }
  function setP<K extends keyof ProductForm>(key: K, value: ProductForm[K]) { setProduct(prev => ({ ...prev, [key]: value })); }
  function startNew() {
    setCategory({ ...emptyCategory });
    setProduct({ ...emptyProduct, category_id: catalog?.categories[0]?.id || "", price_tiers: [{ minQty: 1, maxQty: null, pricePerUnit: null }] });
    setEditing(true); setError(""); setNotice(""); setImagePreviewError(false);
  }
  function startCategory(c: DbCategory) {
    setCategory({ ...c }); setEditing(true); setError(""); setNotice(""); setImagePreviewError(false);
  }
  function startProduct(p: DbProduct) {
    setProduct({ ...p, image_urls: Array.isArray(p.image_urls) ? p.image_urls as string[] : [], price_tiers: Array.isArray(p.price_tiers) ? p.price_tiers.map((t: any) => ({ minQty: Number(t.minQty ?? t.min_qty ?? 1), maxQty: t.maxQty ?? t.max_qty ?? null, pricePerUnit: t.pricePerUnit ?? t.price_per_unit ?? null })) : [{ minQty: 1, maxQty: null, pricePerUnit: null }], stock_qty: p.stock_qty ?? 0 });
    setEditing(true); setError(""); setNotice(""); setImagePreviewError(false);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const current = mode === "categories" ? category : product;
      await api(`/api/admin/${mode}`, current.id ? "PATCH" : "POST", current);
      await reload(); setEditing(false); setNotice(ar ? "تم الحفظ في Supabase بنجاح" : "Saved successfully to Supabase");
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  }
  async function remove(id: string) {
    if (!window.confirm(ar ? "هل تريد الحذف نهائيًا من قاعدة البيانات؟" : "Delete permanently from database?")) return;
    setSaving(true); setError("");
    try { await api(`/api/admin/${mode}`, "DELETE", { id }); await reload(); setNotice(ar ? "تم الحذف" : "Deleted"); }
    catch (err) { setError(err instanceof Error ? err.message : "Delete failed"); }
    finally { setSaving(false); }
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    setSaving(true); setError(""); setNotice(""); setImagePreviewError(false);
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      if (typeof result.url !== "string" || !result.url.startsWith("https://")) throw new Error("Upload did not return a valid image URL.");
      if (mode === "categories") setC("image_url", result.url);
      else setP("image_urls", [result.url]);
      setNotice(ar ? "تم رفع الصورة بنجاح. اضغط حفظ في Supabase لحفظها مع المنتج أو القسم." : "Image uploaded. Click Save to Supabase to attach it to this record.");
    } catch (err) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setSaving(false); }
  }
  if (loading) return <p className="text-text-muted">{ar ? "جاري تحميل البيانات من Supabase..." : "Loading Supabase data..."}</p>;
  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-bold text-text">{mode === "categories" ? (ar ? "إدارة الأقسام" : "Manage categories") : (ar ? "إدارة المنتجات" : "Manage products")}</h1>
        <p className="text-sm text-text-muted">{ar ? "أي تعديل هنا يتم حفظه في قاعدة البيانات." : "Changes save to the database."}</p></div>
      <button onClick={startNew} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{ar ? (mode === "categories" ? "+ إضافة قسم" : "+ إضافة منتج") : (mode === "categories" ? "+ Add category" : "+ Add product")}</button>
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-border bg-surface p-3 text-sm text-text">{notice}</p>}
    {editing && <form onSubmit={save} className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex justify-between"><h2 className="font-bold text-text">{ar ? (mode === "categories" ? "بيانات القسم" : "بيانات المنتج") : "Details"}</h2><ActionButton onClick={() => setEditing(false)}>{ar ? "إلغاء" : "Cancel"}</ActionButton></div>
      {mode === "categories" ? <>
        <div className="grid gap-4 sm:grid-cols-2"><Input label="الاسم بالعربية / Arabic name" required direction="rtl" value={category.name_ar} onChange={v => setC("name_ar", v)} /><Input label="English name" required direction="ltr" value={category.name_en} onChange={v => setC("name_en", v)} /></div>
        <Input label="Slug (English lowercase, e.g. cleaning-supplies)" required direction="ltr" value={category.slug} onChange={v => setC("slug", v)} />
        <Input label="الوصف بالعربية" direction="rtl" value={category.description_ar || ""} onChange={v => setC("description_ar", v)} />
        <Input label="Description in English" value={category.description_en || ""} onChange={v => setC("description_en", v)} />
        <Input label="Image URL" direction="ltr" value={category.image_url || ""} onChange={v => setC("image_url", v)} />
        <label className="block text-sm text-text">{ar ? "أو ارفع صورة القسم" : "Or upload category image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => upload(e.target.files?.[0])} className="mt-2 block w-full text-sm" /></label>
        <Check label={ar ? "قسم ظاهر للزوار" : "Visible to visitors"} checked={category.is_active} onChange={v => setC("is_active", v)} />
      </> : <>
        <div className="grid gap-4 sm:grid-cols-2"><Input label="اسم المنتج بالعربي" required direction="rtl" value={product.name_ar} onChange={v => setP("name_ar", v)} /><Input label="Product name in English" required direction="ltr" value={product.name_en} onChange={v => setP("name_en", v)} /></div>
        <Input label="Slug (e.g. paper-cups-8oz)" required direction="ltr" value={product.slug} onChange={v => setP("slug", v)} />
        <label className="block text-sm text-text">{ar ? "القسم" : "Category"}<select required value={product.category_id} onChange={e => setP("category_id", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg p-2.5">{!product.category_id && <option value="">{ar ? "اختار القسم" : "Choose category"}</option>}{catalog?.categories.map(c => <option key={c.id} value={c.id}>{ar ? c.name_ar : c.name_en}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2"><Input label="وصف المنتج بالعربية" direction="rtl" value={product.description_ar || ""} onChange={v => setP("description_ar", v)} /><Input label="Description in English" value={product.description_en || ""} onChange={v => setP("description_en", v)} /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-text">{ar ? "وحدة البيع" : "Unit"}<select value={product.unit} onChange={e => setP("unit", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg p-2.5">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></label>
          <Input type="number" label={ar ? "أقل كمية للطلب" : "Minimum order qty"} value={product.min_order_qty} onChange={v => setP("min_order_qty", Number(v))} />
          <Input type="number" label={ar ? "كمية المخزون" : "Stock quantity"} value={product.stock_qty ?? 0} onChange={v => setP("stock_qty", Number(v))} />
        </div>
        <Input label={ar ? "رابط صورة المنتج" : "Product image URL"} value={product.image_urls[0] || ""} onChange={v => { setP("image_urls", v ? [v] : []); setImagePreviewError(false); }} />
        <label className="block text-sm text-text">{ar ? "أو ارفع صورة المنتج" : "Or upload a product photo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => upload(e.target.files?.[0])} className="mt-2 block w-full text-sm" /></label>
        {product.image_urls[0] ? (
          <div className="space-y-2 rounded-lg border border-border bg-bg p-3">
            <p className="text-sm font-medium text-text">{ar ? "معاينة صورة المنتج" : "Product image preview"}</p>
            {!imagePreviewError ? (
              <Image src={product.image_urls[0]} width={320} height={220} unoptimized alt={product.name_ar || product.name_en || "Product photo"} onError={() => setImagePreviewError(true)} className="h-48 w-64 max-w-full rounded-lg border border-border object-contain" />
            ) : (
              <p className="text-sm text-red-700">{ar ? "تعذر عرض الصورة. افتح رابطها بالأسفل وتأكد أنها متاحة." : "Image could not load. Open its URL below to check access."}</p>
            )}
            <a href={product.image_urls[0]} target="_blank" rel="noreferrer" className="block break-all text-xs text-brand underline">{ar ? "فتح رابط الصورة للتأكد" : "Open image link to verify"}</a>
            <p className="text-xs text-text-muted">{ar ? "لو رفعت صورة جديدة، اضغط حفظ في Supabase بعد ظهور المعاينة." : "After uploading a new image, click Save to Supabase to keep it."}</p>
          </div>
        ) : (
          <p className="text-xs text-text-muted">{ar ? "لم يتم ربط صورة بهذا المنتج بعد." : "No image attached to this product yet."}</p>
        )}
        <div className="space-y-3 rounded-lg bg-surface-muted p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-text">{ar ? "شرائح الأسعار حسب الكمية (جنيه مصري)" : "Quantity price tiers (EGP)"}</h3><ActionButton onClick={() => setP("price_tiers", [...product.price_tiers.slice(0, -1), { ...product.price_tiers[product.price_tiers.length - 1], maxQty: Math.max(1, product.price_tiers[product.price_tiers.length - 1].minQty) + 9 }, { minQty: Math.max(1, product.price_tiers[product.price_tiers.length - 1].minQty) + 10, maxQty: null, pricePerUnit: null }])}>{ar ? "+ شريحة" : "+ Tier"}</ActionButton></div>
          <p className="text-xs text-text-muted">{ar ? "اكتب سعر الوحدة، أو اتركه فارغًا لطلب عرض سعر. يجب أن تبدأ الشرائح من 1 وتكون متتالية." : "Leave price blank for request-a-quote. Tiers must start at 1 and be consecutive."}</p>
          {product.price_tiers.map((tier, index) => <div key={index} className="grid grid-cols-3 gap-2">
            <Input label="From" type="number" value={tier.minQty} onChange={v => setP("price_tiers", product.price_tiers.map((t, i) => i === index ? { ...t, minQty: Number(v) } : t))} />
            <Input label="To (blank = +)" type="number" value={tier.maxQty ?? ""} onChange={v => setP("price_tiers", product.price_tiers.map((t, i) => i === index ? { ...t, maxQty: v === "" ? null : Number(v) } : t))} />
            <Input label="EGP / unit" type="number" value={tier.pricePerUnit ?? ""} onChange={v => setP("price_tiers", product.price_tiers.map((t, i) => i === index ? { ...t, pricePerUnit: v === "" ? null : Number(v) } : t))} />
          </div>)}
          {product.price_tiers.length > 1 && <ActionButton onClick={() => setP("price_tiers", product.price_tiers.slice(0, -2).concat([{ ...product.price_tiers[product.price_tiers.length - 2], maxQty: null }]))}>{ar ? "حذف آخر شريحة" : "Remove last tier"}</ActionButton>}
        </div>
        <div className="flex flex-wrap gap-5"><Check label={ar ? "متوفر في المخزون" : "In stock"} checked={product.in_stock} onChange={v => setP("in_stock", v)} /><Check label={ar ? "ظاهر للزوار" : "Visible to visitors"} checked={product.is_active} onChange={v => setP("is_active", v)} /></div>
      </>}
      <button disabled={saving} type="submit" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? (ar ? "جاري الحفظ..." : "Saving...") : (ar ? "حفظ في Supabase" : "Save to Supabase")}</button>
    </form>}
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-sm"><thead className="bg-surface-muted text-start text-text-muted"><tr><th className="p-3 text-start">{ar ? "الاسم" : "Name"}</th><th className="p-3 text-start">Slug</th><th className="p-3 text-start">{ar ? "الحالة" : "Status"}</th><th className="p-3 text-start">{ar ? "إجراءات" : "Actions"}</th></tr></thead>
        <tbody>{(mode === "categories" ? catalog?.categories : catalog?.products)?.map(row => <tr key={row.id} className="border-t border-border"><td className="p-3 font-semibold text-text"><div className="flex items-center gap-3">{mode === "products" && Array.isArray((row as DbProduct).image_urls) && typeof (row as DbProduct).image_urls[0] === "string" && <Image src={(row as DbProduct).image_urls[0] as string} alt="" width={48} height={48} unoptimized className="h-12 w-12 rounded-md border border-border object-cover" />}{ar ? row.name_ar : row.name_en}</div></td><td className="p-3 text-text-muted">{row.slug}</td><td className="p-3 text-text-muted">{row.is_active ? (ar ? "ظاهر" : "Visible") : (ar ? "مخفي" : "Hidden")}</td><td className="flex flex-wrap gap-2 p-3"><ActionButton onClick={() => mode === "categories" ? startCategory(row as DbCategory) : startProduct(row as DbProduct)}>{ar ? "تعديل" : "Edit"}</ActionButton><ActionButton danger onClick={() => remove(row.id)}>{ar ? "حذف" : "Delete"}</ActionButton></td></tr>)}</tbody>
      </table>
      {(mode === "categories" ? catalog?.categories.length : catalog?.products.length) === 0 && <p className="p-5 text-center text-text-muted">{ar ? "لا توجد بيانات بعد. ابدأ بإضافة قسم ثم منتجات." : "No records yet. Add a category, then products."}</p>}
    </div>
  </section>;
}
