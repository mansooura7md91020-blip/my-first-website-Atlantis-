import { Category } from "@/lib/types";

/**
 * DEMO DATA — replace via /admin/categories. Shape mirrors the planned
 * Supabase `categories` table (id, slug, name_ar, name_en, description_ar,
 * description_en, image_url, sectors jsonb).
 */
export const categories: Category[] = [
  {
    id: "cat-cleaning",
    slug: "cleaning-products",
    name: { ar: "منتجات التنظيف", en: "Cleaning Products" },
    description: {
      ar: "مطهرات، منظفات أرضيات، ديتول، صابون سائل ومستلزمات النظافة العامة.",
      en: "Disinfectants, floor cleaners, hand soap and general cleaning essentials.",
    },
    image: "/images/products/floor-cleaner.jpg",
    sectors: [
      { ar: "فنادق ومطاعم", en: "Hotels & Restaurants" },
      { ar: "مستشفيات", en: "Hospitals" },
    ],
  },
  {
    id: "cat-plastic",
    slug: "plastic-products",
    name: { ar: "منتجات بلاستيكية", en: "Plastic Products" },
    description: {
      ar: "أكياس، أدوات بلاستيكية، وحاويات للاستخدام التجاري والمنزلي.",
      en: "Bags, plastic utensils and containers for commercial and household use.",
    },
    image: "/images/products/trash-bags.jpg",
    sectors: [{ ar: "مطاعم", en: "Restaurants" }],
  },
  {
    id: "cat-cups",
    slug: "cups",
    name: { ar: "أكواب", en: "Cups" },
    description: {
      ar: "أكواب ورقية وبلاستيكية بمقاسات متعددة للمشروبات الساخنة والباردة.",
      en: "Paper and plastic cups in multiple sizes for hot and cold drinks.",
    },
    image: "/images/products/paper-cups.jpg",
    sectors: [{ ar: "كافيهات", en: "Cafés" }],
  },
  {
    id: "cat-food-containers",
    slug: "plates-food-containers",
    name: { ar: "أطباق وعبوات طعام", en: "Plates & Food Containers" },
    description: {
      ar: "أطباق وعبوات تغليف طعام للاستخدام مرة واحدة، مناسبة للتوصيل والمطاعم.",
      en: "Disposable plates and food packaging suited for delivery and restaurants.",
    },
    image: "/images/products/food-container-clear.jpg",
    sectors: [{ ar: "مطاعم", en: "Restaurants" }],
  },
  {
    id: "cat-restaurant",
    slug: "restaurant-supplies",
    name: { ar: "مستلزمات المطاعم", en: "Restaurant Supplies" },
    description: {
      ar: "كل ما يحتاجه المطعم من أدوات تقديم ومستلزمات تشغيل يومية.",
      en: "Everything a restaurant needs for daily service and operations.",
    },
    image: "/images/products/cutlery.jpg",
    sectors: [{ ar: "مطاعم", en: "Restaurants" }],
  },
  {
    id: "cat-cafe",
    slug: "cafe-supplies",
    name: { ar: "مستلزمات الكافيهات", en: "Café Supplies" },
    description: {
      ar: "أدوات وتجهيزات مخصصة لتشغيل الكافيهات باحترافية.",
      en: "Tools and consumables tailored to running a professional café.",
    },
    image: "/images/products/cold-cups.jpg",
    sectors: [{ ar: "كافيهات", en: "Cafés" }],
  },
  {
    id: "cat-paper",
    slug: "paper-products",
    name: { ar: "منتجات ورقية", en: "Paper Products" },
    description: {
      ar: "مناديل، مفارش ورقية، ورق تغليف وحلول ورقية متنوعة.",
      en: "Napkins, paper table covers, wrapping paper and related consumables.",
    },
    image: "/images/products/paper-towels.jpg",
    sectors: [{ ar: "مطاعم ومكاتب", en: "Restaurants & Offices" }],
  },
  {
    id: "cat-school",
    slug: "school-supplies",
    name: { ar: "مستلزمات المدارس", en: "School Supplies" },
    description: {
      ar: "مستلزمات نظافة وتموين عامة للمدارس والمنشآت التعليمية.",
      en: "Cleaning and general supply essentials for schools and educational facilities.",
    },
    image: "/images/products/gloves-sanitizer.jpg",
    sectors: [{ ar: "مدارس", en: "Schools" }],
  },
  {
    id: "cat-hospital",
    slug: "hospital-supplies",
    name: { ar: "مستلزمات المستشفيات", en: "Hospital Supplies" },
    description: {
      ar: "مستلزمات تعقيم ونظافة عامة تلبي احتياجات المنشآت الصحية.",
      en: "Sanitation and general-supply items suited to healthcare facilities.",
    },
    image: "/images/products/school-supplies.jpg",
    sectors: [{ ar: "مستشفيات", en: "Hospitals" }],
  },
  {
    id: "cat-institutions",
    slug: "company-institution-supplies",
    name: { ar: "مستلزمات الشركات والمؤسسات", en: "Company & Institution Supplies" },
    description: {
      ar: "توريدات عمومية بالجملة للشركات والمؤسسات والجهات الحكومية.",
      en: "Bulk general supplies for companies, institutions and government entities.",
    },
    image: "/images/products/school-supplies.jpg",
    sectors: [{ ar: "شركات", en: "Companies" }],
  },
];

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}
