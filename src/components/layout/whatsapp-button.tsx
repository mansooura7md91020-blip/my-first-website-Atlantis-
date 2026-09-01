"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";

/**
 * Opens wa.me with a pre-filled message. This is intentionally the ONLY
 * WhatsApp integration in v1 — there is no WhatsApp Business API call here.
 * See lib/utils/whatsapp.ts for where that would plug in later.
 */
export function WhatsAppButton({
  phone,
  message,
  floating = true,
}: {
  phone: string;
  message: string;
  floating?: boolean;
}) {
  const { t } = useI18n();
  const href = buildWhatsAppLink(phone, message);

  if (!floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="card-shadow inline-flex items-center gap-2.5 rounded-xl bg-[#1FAF5C] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1c9e53]"
      >
        <WhatsAppIcon className="h-4.5 w-4.5" />
        {t("common.whatsappUs")}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("common.whatsappUs")}
      className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FAF5C] text-white shadow-[0_8px_24px_-6px_rgba(31,175,92,0.55)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-6.5 w-6.5" />
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.22.6 4.3 1.65 6.1L4 29l8.06-1.6a12.9 12.9 0 0 0 3.96.62c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3Zm0 21.86c-1.9 0-3.66-.5-5.2-1.44l-.37-.22-4.78.95.98-4.66-.24-.38a9.78 9.78 0 0 1-1.5-5.19c0-5.42 4.4-9.82 9.83-9.82 5.42 0 9.83 4.4 9.83 9.82 0 5.43-4.41 9.94-9.55 9.94Zm5.4-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.2-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.24-.7.24-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
