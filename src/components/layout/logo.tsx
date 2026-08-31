import { cn } from "@/lib/utils/cn";

/**
 * Logo concept: an "A" formed by two converging wave crests (Atlantis / depth),
 * with a single sand-gold droplet marking the peak — the one accent color in
 * the whole identity. Works as a standalone mark (favicon, admin) or full
 * lockup with the bilingual wordmark (header).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--brand-strong, #0B3D42)" />
      <path
        d="M24 10 L34 34 H29.5 L27.3 28.5 H20.7 L18.5 34 H14 L24 10 Z M24 18.5 L21.6 24.5 H26.4 L24 18.5 Z"
        fill="#F7FAF9"
      />
      <path
        d="M9 38c3-2.4 6-2.4 9 0s6 2.4 9 0 6-2.4 9 0 6 2.4 9 0"
        stroke="#D9A441"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  className,
  wordmarkClassName,
  companyNameAr,
  brandName,
  variant = "auto",
}: {
  className?: string;
  wordmarkClassName?: string;
  companyNameAr: string;
  brandName: string;
  /** "auto" shows the localized subtitle beneath the ATLANTIS wordmark. */
  variant?: "auto" | "mark-only";
}) {
  if (variant === "mark-only") return <LogoMark className={className} />;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-bold tracking-wide text-text", wordmarkClassName)}>
          {brandName}
        </span>
        <span className="text-[11px] text-text-muted">{companyNameAr}</span>
      </span>
    </span>
  );
}
