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
    image: "https://images.pexels.com/photos/5217885/pexels-photo-5217885.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/5719893/pexels-photo-5719893.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/7319334/pexels-photo-7319334.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/27438824/pexels-photo-27438824.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/28317223/pexels-photo-28317223.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/6312185/pexels-photo-6312185.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/17719822/pexels-photo-17719822.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/3999527/pexels-photo-3999527.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/7451952/pexels-photo-7451952.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    image: "https://images.pexels.com/photos/28317223/pexels-photo-28317223.jpeg?auto=compress&cs=tinysrgb&w=1200",
    sectors: [{ ar: "شركات", en: "Companies" }],
  },
];

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}
