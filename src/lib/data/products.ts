import { Product } from "@/lib/types";

/**
 * DEMO DATA — for UI purposes only. Prices, stock and descriptions here are
 * illustrative placeholders and are NOT the company's real price list.
 * This will become a Supabase `products` table + a related
 * `product_price_tiers` table (product_id, min_qty, max_qty, unit_price).
 */
export const products: Product[] = [
  {
    id: "prod-1",
    slug: "multi-surface-disinfectant-5l",
    categoryId: "cat-cleaning",
    name: { ar: "مطهر أسطح متعدد الاستخدامات 5 لتر", en: "Multi-Surface Disinfectant 5L" },
    shortDescription: {
      ar: "مطهر قوي مناسب للمطابخ والمستشفيات والمدارس.",
      en: "Strong disinfectant suited for kitchens, hospitals and schools.",
    },
    description: {
      ar: "مطهر أسطح فعال يقضي على 99.9% من الجراثيم، مناسب للاستخدام التجاري في المطاعم والمستشفيات والمدارس. يأتي في عبوة 5 لتر اقتصادية.",
      en: "An effective surface disinfectant that eliminates 99.9% of germs. Suited for commercial use in restaurants, hospitals and schools. Comes in an economical 5-liter container.",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "liter",
    minOrderQty: 5,
    priceTiers: [
      { minQty: 1, maxQty: 19, pricePerUnit: 85 },
      { minQty: 20, maxQty: 99, pricePerUnit: 78 },
      { minQty: 100, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 240,
    isDemo: true,
  },
  {
    id: "prod-2",
    slug: "disposable-paper-cups-8oz",
    categoryId: "cat-cups",
    name: { ar: "أكواب ورقية 8 أونصة", en: "Disposable Paper Cups 8oz" },
    shortDescription: {
      ar: "أكواب ورقية مناسبة للمشروبات الساخنة، عبوة 50 كوب.",
      en: "Paper cups suited for hot beverages, pack of 50.",
    },
    description: {
      ar: "أكواب ورقية عالية الجودة مقاومة للتسرب، مثالية للكافيهات والمطاعم. تُباع بالكرتونة الواحدة تحتوي على 20 عبوة (1000 كوب).",
      en: "High-quality leak-resistant paper cups, ideal for cafés and restaurants. Sold by the carton — 20 packs of 50 cups (1,000 cups) per carton.",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 420 },
      { minQty: 5, maxQty: 19, pricePerUnit: 390 },
      { minQty: 20, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 60,
    isDemo: true,
  },
  {
    id: "prod-3",
    slug: "food-container-500ml",
    categoryId: "cat-food-containers",
    name: { ar: "عبوة طعام 500 مل مع غطاء", en: "Food Container 500ml with Lid" },
    shortDescription: {
      ar: "عبوات آمنة للطعام مناسبة لخدمة التوصيل.",
      en: "Food-safe containers suited for delivery service.",
    },
    description: {
      ar: "عبوات بلاستيكية آمنة للطعام مقاومة للتسرب مع أغطية محكمة، مناسبة لمطاعم التوصيل والكافيتريات. تُباع بالكرتونة (150 عبوة).",
      en: "Leak-resistant, food-safe plastic containers with tight-fitting lids — ideal for delivery restaurants and cafeterias. Sold by the carton (150 containers).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 310 },
      { minQty: 10, maxQty: 49, pricePerUnit: 285 },
      { minQty: 50, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 35,
    isDemo: true,
  },
  {
    id: "prod-4",
    slug: "heavy-duty-trash-bags",
    categoryId: "cat-plastic",
    name: { ar: "أكياس قمامة ثقيلة", en: "Heavy-Duty Trash Bags" },
    shortDescription: {
      ar: "أكياس قمامة متينة بمقاسات كبيرة للاستخدام التجاري.",
      en: "Durable, large-size trash bags for commercial use.",
    },
    description: {
      ar: "أكياس قمامة سوداء ثقيلة مقاومة للتمزق، مناسبة للمطاعم والمصانع والمنشآت الكبيرة. تُباع بالكرتونة الواحدة (10 رولات).",
      en: "Heavy black tear-resistant trash bags, suited for restaurants, factories and large facilities. Sold by the carton (10 rolls).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 260 },
      { minQty: 10, maxQty: 49, pricePerUnit: 235 },
      { minQty: 50, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 80,
    isDemo: true,
  },
  {
    id: "prod-5",
    slug: "napkins-2ply-pack",
    categoryId: "cat-paper",
    name: { ar: "مناديل ورقية طبقتين", en: "2-Ply Paper Napkins" },
    shortDescription: {
      ar: "مناديل ناعمة ماصة للاستخدام في المطاعم والكافيهات.",
      en: "Soft, absorbent napkins for restaurant and café use.",
    },
    description: {
      ar: "مناديل ورقية من طبقتين، ناعمة وماصة، مناسبة للتقديم اليومي في المطاعم والكافيهات. تُباع بالكرتونة (24 عبوة).",
      en: "Soft, absorbent 2-ply paper napkins suited for daily service in restaurants and cafés. Sold by the carton (24 packs).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 190 },
      { minQty: 5, maxQty: 19, pricePerUnit: 175 },
      { minQty: 20, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 120,
    isDemo: true,
  },
  {
    id: "prod-6",
    slug: "liquid-hand-soap-1l",
    categoryId: "cat-cleaning",
    name: { ar: "صابون سائل لليدين 1 لتر", en: "Liquid Hand Soap 1L" },
    shortDescription: {
      ar: "صابون سائل لطيف على البشرة مناسب للاستخدام المتكرر.",
      en: "Gentle liquid hand soap suited for frequent use.",
    },
    description: {
      ar: "صابون سائل لطيف على اليدين، مناسب لدورات المياه في المدارس والمستشفيات والمطاعم. يُباع بالكرتونة (12 عبوة).",
      en: "Gentle liquid hand soap suited for restrooms in schools, hospitals and restaurants. Sold by the carton (12 bottles).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 340 },
      { minQty: 10, maxQty: 39, pricePerUnit: 310 },
      { minQty: 40, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 45,
    isDemo: true,
  },
  {
    id: "prod-7",
    slug: "plastic-cutlery-set",
    categoryId: "cat-plastic",
    name: { ar: "طقم أدوات مائدة بلاستيكية", en: "Plastic Cutlery Set" },
    shortDescription: {
      ar: "ملاعق وشوك وسكاكين بلاستيكية للاستخدام مرة واحدة.",
      en: "Disposable plastic spoons, forks and knives.",
    },
    description: {
      ar: "طقم أدوات مائدة بلاستيكية متينة، مناسبة لمطاعم التوصيل والمناسبات. تُباع بالكرتونة (500 طقم).",
      en: "Durable disposable cutlery sets, suited for delivery restaurants and events. Sold by the carton (500 sets).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 450 },
      { minQty: 5, maxQty: 19, pricePerUnit: 410 },
      { minQty: 20, maxQty: null, pricePerUnit: null },
    ],
    inStock: false,
    stockQty: 0,
    isDemo: true,
  },
  {
    id: "prod-8",
    slug: "floor-cleaner-lavender-5l",
    categoryId: "cat-cleaning",
    name: { ar: "منظف أرضيات لافندر 5 لتر", en: "Lavender Floor Cleaner 5L" },
    shortDescription: {
      ar: "منظف أرضيات معطر برائحة اللافندر بتركيز عالي.",
      en: "Concentrated, lavender-scented floor cleaner.",
    },
    description: {
      ar: "منظف أرضيات عالي التركيز برائحة اللافندر، مناسب للمساحات الكبيرة في المدارس والمكاتب والمولات. عبوة 5 لتر.",
      en: "A highly concentrated, lavender-scented floor cleaner suited for large spaces such as schools, offices and malls. 5-liter container.",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "liter",
    minOrderQty: 5,
    priceTiers: [
      { minQty: 1, maxQty: 19, pricePerUnit: 95 },
      { minQty: 20, maxQty: 99, pricePerUnit: 88 },
      { minQty: 100, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 150,
    isDemo: true,
  },
  {
    id: "prod-9",
    slug: "cold-cups-16oz",
    categoryId: "cat-cups",
    name: { ar: "أكواب باردة 16 أونصة", en: "Cold Cups 16oz" },
    shortDescription: {
      ar: "أكواب بلاستيكية شفافة للمشروبات الباردة.",
      en: "Clear plastic cups for cold beverages.",
    },
    description: {
      ar: "أكواب بلاستيكية شفافة عالية الجودة، مثالية لعصائر الكافيهات والمشروبات الباردة. تُباع بالكرتونة (1000 كوب).",
      en: "High-quality clear plastic cups, ideal for café juices and cold drinks. Sold by the carton (1,000 cups).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 480 },
      { minQty: 5, maxQty: 19, pricePerUnit: 445 },
      { minQty: 20, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 90,
    isDemo: true,
  },
  {
    id: "prod-10",
    slug: "institutional-bleach-5l",
    categoryId: "cat-institutions",
    name: { ar: "مبيض مؤسسي 5 لتر", en: "Institutional Bleach 5L" },
    shortDescription: {
      ar: "مبيض عالي الفعالية للمنشآت الكبيرة.",
      en: "High-strength bleach for large facilities.",
    },
    description: {
      ar: "مبيض بتركيز عالي مناسب للتعقيم العام في الشركات والمصانع والمنشآت الحكومية. عبوة 5 لتر.",
      en: "A high-concentration bleach suited for general sanitation in companies, factories and government facilities. 5-liter container.",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "liter",
    minOrderQty: 5,
    priceTiers: [
      { minQty: 1, maxQty: 19, pricePerUnit: 70 },
      { minQty: 20, maxQty: 99, pricePerUnit: 63 },
      { minQty: 100, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 300,
    isDemo: true,
  },
  {
    id: "prod-11",
    slug: "coffee-sleeves-pack",
    categoryId: "cat-cafe",
    name: { ar: "أكمام أكواب القهوة", en: "Coffee Cup Sleeves" },
    shortDescription: {
      ar: "أكمام كرتونية عازلة للحرارة لأكواب القهوة الساخنة.",
      en: "Heat-insulating cardboard sleeves for hot coffee cups.",
    },
    description: {
      ar: "أكمام عازلة للحرارة تحمي يد العميل عند تقديم المشروبات الساخنة. تُباع بالكرتونة (2000 كم).",
      en: "Heat-insulating sleeves that protect the customer's hand when serving hot drinks. Sold by the carton (2,000 sleeves).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 260 },
      { minQty: 5, maxQty: 19, pricePerUnit: 235 },
      { minQty: 20, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 55,
    isDemo: true,
  },
  {
    id: "prod-12",
    slug: "school-hand-sanitizer-500ml",
    categoryId: "cat-school",
    name: { ar: "معقم أيدي للمدارس 500 مل", en: "Hand Sanitizer for Schools 500ml" },
    shortDescription: {
      ar: "معقم أيدي آمن مناسب للاستخدام اليومي في المدارس.",
      en: "Safe hand sanitizer suited for daily school use.",
    },
    description: {
      ar: "معقم أيدي لطيف وفعال، مناسب للاستخدام اليومي من قبل الطلاب والمعلمين. يُباع بالكرتونة (24 عبوة).",
      en: "A gentle and effective hand sanitizer suited for daily use by students and staff. Sold by the carton (24 bottles).",
    },
    images: ["/logo/product-placeholder.svg"],
    unit: "carton",
    minOrderQty: 1,
    priceTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 300 },
      { minQty: 10, maxQty: 39, pricePerUnit: 275 },
      { minQty: 40, maxQty: null, pricePerUnit: null },
    ],
    inStock: true,
    stockQty: 70,
    isDemo: true,
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return products.filter((p) => p.categoryId === categoryId);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.slice(0, limit);
}
