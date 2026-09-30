import { cn } from "@/lib/utils/cn";

/**
 * ATLANTIS mark — "The Keystone"
 *
 * A geometric monogram "A" built from two converging strokes and a
 * crossbar, capped by a faceted keystone at the apex — the load-bearing
 * stone that locks an arch in place. It reads as engineering/structure
 * (fit for a B2B supply business) and doubles as a nod to Atlantis
 * without leaning on a literal wave or ocean cliché. The mark is a
 * single confident shape that stays legible at favicon size and
 * reduces cleanly to one flat color for print/quotation documents.
 *
 * `tone="badge"` (default) sits on a rounded-square brand-colored tile
 * and auto-adapts between light/dark via CSS variables. `tone="on-brand"`
 * strips the tile for use on an already-colored surface (e.g. the hero
 * or the footer). `tone="mono"` renders as a single flat `currentColor`
 * shape with no fill tile — for print, quotation PDFs, or any context
 * where only one color is guaranteed.
 */
export function LogoMark({
  className,
  tone = "badge",
}: {
  className?: string;
  tone?: "badge" | "on-brand" | "mono";
}) {
  if (tone === "mono") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
        <path
          d="M14 37 24 15.5M34 37 24 15.5M18.4 27h11.2"
          stroke="currentColor"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M24 7.5 28.3 11.5 24 15.5 19.7 11.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (tone === "on-brand") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
        <path
          d="M14 37 24 15.5M34 37 24 15.5M18.4 27h11.2"
          stroke="#fff"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M24 7.5 28.3 11.5 24 15.5 19.7 11.5Z" fill="#D9A047" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--brand-strong)" />
      <path
        d="M14 37 24 15.5M34 37 24 15.5M18.4 27h11.2"
        stroke="var(--surface)"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 7.5 28.3 11.5 24 15.5 19.7 11.5Z" fill="var(--accent)" />
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
  tone?: "badge" | "on-brand" | "mono";
  /** "full" shows the wordmark + Arabic subtitle; "mark-only" shows just the icon. */
  variant?: "full" | "mark-only";
}) {
  if (variant === "mark-only") return <LogoMark className={className} tone={tone} />;

  const textColor = tone === "on-brand" ? "text-white" : tone === "mono" ? "text-current" : "text-text";
  const subColor = tone === "on-brand" ? "text-white/65" : tone === "mono" ? "text-current opacity-60" : "text-text-muted";

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
