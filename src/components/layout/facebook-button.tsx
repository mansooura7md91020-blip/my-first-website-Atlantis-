/** Floating Facebook contact button, placed above the existing WhatsApp action. */
export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.1 0 2.26.2 2.26.2v2.49H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.88h-2.33v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function FacebookButton({ url, locale }: { url: string; locale: "ar" | "en" }) {
  const label = locale === "ar" ? "صفحة أطلنتس على فيسبوك" : "Atlantis Facebook page";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-24 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_8px_24px_-6px_rgba(24,119,242,0.5)] transition-transform hover:scale-105 hover:bg-[#1264cd]"
    >
      <FacebookIcon className="h-7 w-7" />
    </a>
  );
}
