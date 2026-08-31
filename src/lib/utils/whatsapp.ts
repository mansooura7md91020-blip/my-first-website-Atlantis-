/**
 * WhatsApp helper — v1 only opens wa.me with a pre-filled message (no
 * WhatsApp Business API involved). Templates come from CompanySettings so
 * they stay editable from /admin/settings. When the WhatsApp Business API
 * is integrated later, `sendTemplatedWhatsAppMessage()` is the one place
 * that would change to call the API instead of building a wa.me link.
 */

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Converts a local Egyptian number like 01050009920 to international 20105... format for wa.me */
export function toWhatsAppNumber(localNumber: string): string {
  const digits = digitsOnly(localNumber);
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return `20${digits}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const number = toWhatsAppNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Replaces {placeholders} in a template string, e.g. "{orderId}" -> "123". */
export function renderTemplate(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}
