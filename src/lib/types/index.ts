/**
 * Shared domain types.
 *
 * These interfaces are written to map 1:1 onto future Supabase tables
 * (see /supabase/schema.sql in the README for the planned DDL). Keeping
 * the shape identical now means swapping `lib/data/*` from static arrays
 * to Supabase queries later requires no changes to components.
 */

export type Locale = "ar" | "en";

/** A string that must be provided in both supported languages. */
export interface LocalizedText {
  ar: string;
  en: string;
}

export type Unit = "piece" | "pack" | "carton" | "kg" | "liter" | "box" | "roll";

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  /** Which sectors typically buy from this category, used for "Supplies for" chips. */
  sectors: LocalizedText[];
}

/** One row of a quantity-based pricing ladder. Max = null means "and above". */
export interface PriceTier {
  minQty: number;
  maxQty: number | null;
  /** Price per unit in EGP. Null means "quote required" for this tier. */
  pricePerUnit: number | null;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  images: string[];
  unit: Unit;
  /** Smallest quantity a customer may order. */
  minOrderQty: number;
  priceTiers: PriceTier[];
  inStock: boolean;
  /** Optional low-stock threshold for admin alerts. */
  stockQty?: number;
  isDemo?: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  | "received"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  deliveryAddress: string;
  lines: CartLine[];
  status: OrderStatus;
  /** Set per-order by an admin — never a fixed site-wide policy. */
  paymentTerms?: string;
  notes?: string;
}

export type SupplyRequestStatus = "new" | "reviewing" | "quoted" | "accepted" | "declined";

export interface SupplyRequestItem {
  productName: string;
  quantity: number;
  unit: Unit;
}

export interface SupplyRequest {
  id: string;
  createdAt: string;
  customerName: string;
  organizationName: string;
  organizationType: LocalizedText;
  phone: string;
  email?: string;
  items: SupplyRequestItem[];
  deliveryLocation: string;
  requestedDeliveryDate?: string;
  notes?: string;
  status: SupplyRequestStatus;
}

export interface Quotation {
  id: string;
  supplyRequestId: string;
  createdAt: string;
  validUntil?: string;
  lines: { description: string; quantity: number; unit: Unit; unitPrice: number }[];
  /** Free-text, agreed per quotation — e.g. "50% deposit, balance on delivery". */
  paymentTerms: string;
  deliveryTerms?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
}

export interface Customer {
  id: string;
  name: string;
  organizationName?: string;
  phone: string;
  email?: string;
  isBusinessAccount: boolean;
}

/** Company-wide settings — all editable from /admin/settings, never hard-coded in UI. */
export interface CompanySettings {
  legalName: LocalizedText;
  brandName: string;
  salesRepresentative: { name: string; phone: string };
  phone: string;
  whatsapp: string;
  email: string;
  facebookUrl: string | null;
  address: LocalizedText;
  /** Shown as general guidance only — actual terms are set per order/quotation. */
  defaultPaymentTermsNote: LocalizedText;
  whatsappTemplates: {
    orderReceived: LocalizedText;
    orderConfirmed: LocalizedText;
    orderPreparing: LocalizedText;
    supplyRequestReceived: LocalizedText;
    generalInquiry: LocalizedText;
  };
}
