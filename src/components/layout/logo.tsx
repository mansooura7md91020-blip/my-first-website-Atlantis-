import { cn } from "@/lib/utils/cn";

/** Atlantis wave-and-compass-star brand identity, for public site and admin. */
export function LogoMark({
  className,
  tone = "badge",
}: {
  className?: string;
  tone?: "badge" | "on-brand" | "mono";
}) {
  return (
    <img
      src="/logo/atlantis-mark.png"
      alt=""
      aria-hidden="true"
      className={cn("h-8 w-8 shrink-0 object-contain", tone === "mono" && "grayscale", className)}
    />
  );
}

export function Logo({
  className,
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
  variant?: "full" | "mark-only";
}) {
  if (variant === "mark-only") return <LogoMark className={className} tone={tone} />;
  return (
    <span className={cn("inline-flex items-center", className)} title={companyNameAr || brandName}>
      <picture>
        <source srcSet={tone === "on-brand" ? "/logo/atlantis-logo-light.webp" : "/logo/atlantis-logo.webp"} type="image/webp" />
        <img
          src={tone === "on-brand" ? "/logo/atlantis-logo-light.png" : "/logo/atlantis-logo.png"}
          alt="Atlantis Supplies"
          width={2048}
          height={682}
          className="block h-10 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[205px]"
        />
      </picture>
    </span>
  );
}
