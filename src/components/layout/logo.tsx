import { cn } from "@/lib/utils/cn";

/**
 * ATLANTIS SUPPLIES mark.
 *
 * A monogram "A" built as a droplet/shield silhouette (cleanliness,
 * liquid, protection) with the right stroke resolving into a small
 * leaf (freshness/hygiene) and a three-point sparkle at the apex
 * (shine/clean result) — three simple, legible shapes rather than a
 * crowded scene, so it still reads clearly at favicon size. Blue
 * carries the corporate/trust weight, green carries the
 * cleanliness/freshness meaning.
 *
 * `tone="badge"` sits on a rounded tile and auto-adapts light/dark via
 * CSS variables. `tone="on-brand"` strips the tile for use on an
 * already-colored surface. `tone="mono"` is a single flat
 * `currentColor` shape for print/quotation documents.
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
          d="M24 8c6 7 11 12.7 11 18.5A11 11 0 0 1 13 26.5C13 20.7 18 15 24 8Z"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M24 17v15M18.5 27h11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M31.5 15.5c2.6 0 4 1.6 4 4-2.6 0-4-1.6-4-4Z" fill="currentColor" />
      </svg>
    );
  }

  if (tone === "on-brand") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
        <path
          d="M24 8c6 7 11 12.7 11 18.5A11 11 0 0 1 13 26.5C13 20.7 18 15 24 8Z"
          fill="rgba(255,255,255,0.12)"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M24 17v15M18.5 27h11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M31.5 15.5c2.6 0 4 1.6 4 4-2.6 0-4-1.6-4-4Z" fill="#5ED993" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--brand-strong)" />
      <path
        d="M24 10c5.2 6 9.5 10.9 9.5 16A9.5 9.5 0 0 1 14.5 26C14.5 20.9 18.8 16 24 10Z"
        fill="var(--surface)"
        opacity="0.96"
      />
      <path d="M24 18v11.5M19.7 25.5h8.6" stroke="var(--brand-strong)" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M30.5 16.8c2.3 0 3.5 1.4 3.5 3.5-2.3 0-3.5-1.4-3.5-3.5Z" fill="var(--accent)" />
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
  /** "full" shows the ATLANTIS / SUPPLIES wordmark stack; "mark-only" shows just the icon. */
  variant?: "full" | "mark-only";
}) {
  if (variant === "mark-only") return <LogoMark className={className} tone={tone} />;

  const textColor = tone === "on-brand" ? "text-white" : tone === "mono" ? "text-current" : "text-text";
  const subColor =
    tone === "on-brand" ? "text-[#5ED993]" : tone === "mono" ? "text-current opacity-70" : "text-accent-strong";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} title={companyNameAr}>
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cn("font-display text-lg font-bold tracking-[0.06em]", textColor, wordmarkClassName)}
        >
          ATLANTIS
        </span>
        <span className={cn("mt-0.5 text-[10px] font-semibold tracking-[0.22em]", subColor)}>SUPPLIES</span>
      </span>
    </span>
  );
}
