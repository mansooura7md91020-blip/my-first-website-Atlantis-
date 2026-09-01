import { cn } from "@/lib/utils/cn";

/**
 * ATLANTIS mark — "The Twin Pillars"
 *
 * Two columns joined by a lintel, doubling as an abstract "A" and a
 * nod to Atlantis's mythic gateway pillars — reads as stability and
 * structure (fitting a B2B supply business), not a generic wave.
 * A single bronze accent line marks the "waterline" beneath the lintel.
 *
 * Colors are drawn from CSS variables so the mark auto-adapts between
 * light and dark themes without a separate asset. `tone="on-brand"`
 * renders a flat white/bronze version for placement on a solid
 * brand-colored surface (e.g. the hero), where the badge background
 * itself would disappear.
 */
export function LogoMark({
  className,
  tone = "badge",
}: {
  className?: string;
  tone?: "badge" | "on-brand";
}) {
  if (tone === "on-brand") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
        <path d="M10 14h28M13 14v22M35 14v22" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M9 41h30" stroke="#D9A047" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="var(--brand-strong)" />
      <path
        d="M13 15h22M16 15v18M32 15v18"
        stroke="var(--surface)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M12 35h24" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  wordmarkClassName,
  companyNameAr,
  brandName,
  tone = "badge",
  variant = "full",
}: {
  className?: string;
  wordmarkClassName?: string;
  companyNameAr: string;
  brandName: string;
  tone?: "badge" | "on-brand";
  /** "full" shows the wordmark + Arabic subtitle; "mark-only" shows just the icon. */
  variant?: "full" | "mark-only";
}) {
  if (variant === "mark-only") return <LogoMark className={className} tone={tone} />;

  const textColor = tone === "on-brand" ? "text-white" : "text-text";
  const subColor = tone === "on-brand" ? "text-white/65" : "text-text-muted";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-[0.04em]",
            textColor,
            wordmarkClassName
          )}
        >
          {brandName}
        </span>
        <span className={cn("mt-0.5 text-[11px]", subColor)}>{companyNameAr}</span>
      </span>
    </span>
  );
}
