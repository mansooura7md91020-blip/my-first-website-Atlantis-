import { Customer, Order, Quotation, SupplyRequest } from "@/lib/types";

/**
 * DEMO DATA for the admin dashboard only, so screens are never empty.
 * These map to future Supabase tables: orders, order_lines,
 * supply_requests, supply_request_items, quotations, quotation_lines,
 * customers.
 */

export const demoOrders: Order[] = [
  {
    id: "ORD-1001",
    createdAt: "2026-08-20T10:15:00Z",
    customerName: "Mahmoud Adel",
    phone: "0100xxxxxxx",
    email: "mahmoud@example.com",
    deliveryAddress: "Shubra, Cairo",
    lines: [
      { productId: "prod-1", quantity: 10 },
      { productId: "prod-5", quantity: 5 },
    ],
    status: "confirmed",
    paymentTerms: "Cash on delivery",
  },
  {
    id: "ORD-1002",
    createdAt: "2026-08-22T13:40:00Z",
    customerName: "Cairo Bites Restaurant",
    phone: "0111xxxxxxx",
    deliveryAddress: "Nasr City, Cairo",
    lines: [{ productId: "prod-3", quantity: 20 }],
    status: "preparing",
    paymentTerms: "Bank transfer before delivery",
  },
  {
    id: "ORD-1003",
    createdAt: "2026-08-25T09:05:00Z",
    customerName: "Sara Hossam",
    phone: "0122xxxxxxx",
    deliveryAddress: "Maadi, Cairo",
    lines: [{ productId: "prod-9", quantity: 3 }],
    status: "received",
  },
];

export const demoSupplyRequests: SupplyRequest[] = [
  {
    id: "SR-501",
    createdAt: "2026-08-18T08:00:00Z",
    customerName: "Eng. Youssef Kamal",
    organizationName: "Nile Valley Hospital",
    organizationType: { ar: "مستشفى", en: "Hospital" },
    phone: "0100xxxxxxx",
    email: "procurement@nilevalley.example",
    items: [
      { productName: "Multi-Surface Disinfectant 5L", quantity: 200, unit: "liter" },
      { productName: "Liquid Hand Soap 1L", quantity: 150, unit: "carton" },
    ],
    deliveryLocation: "6th of October City",
    requestedDeliveryDate: "2026-09-10",
    notes: "Recurring monthly supply requested — please quote a standing arrangement.",
    status: "reviewing",
  },
  {
    id: "SR-502",
    createdAt: "2026-08-24T12:30:00Z",
    customerName: "Mona Farouk",
    organizationName: "Sunrise International School",
    organizationType: { ar: "مدرسة", en: "School" },
    phone: "0111xxxxxxx",
    items: [{ productName: "Hand Sanitizer for Schools 500ml", quantity: 500, unit: "carton" }],
    deliveryLocation: "New Cairo",
    requestedDeliveryDate: "2026-09-01",
    status: "new",
  },
];

export const demoQuotations: Quotation[] = [
  {
    id: "QT-2001",
    supplyRequestId: "SR-501",
    createdAt: "2026-08-19T10:00:00Z",
    validUntil: "2026-09-02",
    lines: [
      { description: "Multi-Surface Disinfectant 5L", quantity: 200, unit: "liter", unitPrice: 60 },
      { description: "Liquid Hand Soap 1L (carton)", quantity: 150, unit: "carton", unitPrice: 300 },
    ],
    paymentTerms: "50% deposit on confirmation, balance on delivery",
    deliveryTerms: "Delivery within 5 business days of confirmation",
    status: "sent",
  },
];

export const demoCustomers: Customer[] = [
  { id: "cus-1", name: "Mahmoud Adel", phone: "0100xxxxxxx", email: "mahmoud@example.com", isBusinessAccount: false },
  {
    id: "cus-2",
    name: "Eng. Youssef Kamal",
    organizationName: "Nile Valley Hospital",
    phone: "0100xxxxxxx",
    email: "procurement@nilevalley.example",
    isBusinessAccount: true,
  },
  {
    id: "cus-3",
    name: "Mona Farouk",
    organizationName: "Sunrise International School",
    phone: "0111xxxxxxx",
    isBusinessAccount: true,
  },
];
