import { CompanySettings } from "@/lib/types";
import { dbRequest, supabaseConfig } from "@/lib/supabase/rest";
import { mapSettings, DbSettings } from "@/lib/supabase/mappers";

/**
 * DEMO / SEED DATA — this record represents what will live in a single-row
 * `company_settings` table in Supabase. Every field here is editable from
 * /admin/settings. Nothing in the UI should ever import hard-coded phone
 * numbers, emails, or the Facebook URL directly — always go through this
 * (or, later, `getCompanySettings()` backed by Supabase).
 */
export const companySettings: CompanySettings = {
  legalName: {
    ar: "أطلنتس للتوريدات العموميه",
    en: "Atlantis General Supplies",
  },
  brandName: "ATLANTIS",
  catalogLive: false,
  salesRepresentative: {
    name: "أحمد موسى",
    phone: "01050009920",
  },
  phone: "01050009920",
  whatsapp: "01050009920",
  email: "atlantiscompany2012@gmail.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61595681892099&locale=ar_AR",
  address: {
    ar: "جمهورية مصر العربية",
    en: "Arab Republic of Egypt",
  },
  defaultPaymentTermsNote: {
    ar: "يتم تحديد شروط الدفع بالاتفاق المباشر مع العميل لكل طلب أو عرض سعر.",
    en: "Payment terms are agreed directly with each customer, per order or quotation.",
  },
  whatsappTemplates: {
    orderReceived: {
      ar: "تم استلام طلبك رقم {orderId} وسيتم مراجعته من فريقنا.",
      en: "Your order #{orderId} has been received and is being reviewed.",
    },
    orderConfirmed: {
      ar: "تم تأكيد طلبك رقم {orderId}.",
      en: "Your order #{orderId} has been confirmed.",
    },
    orderPreparing: {
      ar: "جاري تجهيز طلبك رقم {orderId}.",
      en: "Your order #{orderId} is being prepared.",
    },
    supplyRequestReceived: {
      ar: "شكراً لطلب التوريد الخاص بكم، سيتواصل معكم فريق المبيعات لإعداد عرض السعر.",
      en: "Thank you for your supply request. Our sales team will contact you to prepare a quotation.",
    },
    generalInquiry: {
      ar: "مرحباً، أرغب في الاستفسار عن منتجاتكم.",
      en: "Hello, I'd like to ask about your products.",
    },
  },
};

/** Async wrapper so pages already call this the way they'll call Supabase later. */
export async function getCompanySettings(): Promise<CompanySettings> {
  if (!supabaseConfig()) return companySettings;
  try {
    const data = await dbRequest("company_settings?select=*&id=eq.1&limit=1");
    return Array.isArray(data) && data[0] ? mapSettings(data[0] as DbSettings) : companySettings;
  } catch (error) {
    console.error("Atlantis public settings unavailable", error);
    return companySettings;
  }
}
