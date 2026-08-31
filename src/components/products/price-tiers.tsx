import { Locale, PriceTier, Unit } from "@/lib/types";
import { formatEGP } from "@/lib/utils/pricing";
import { useI18nServer } from "@/lib/i18n/server-t";

const depthLabels = ["surface", "reef", "deep", "abyss"] as const;
const depthShades = [
  "bg-ocean-100/60",
  "bg-[color-mix(in_srgb,var(--brand)_18%,var(--surface))]",
  "bg-[color-mix(in_srgb,var(--brand)_38%,var(--surface))]",
  "bg-[color-mix(in_srgb,var(--brand-strong)_60%,var(--surface))]",
];

/**
 * Renders a product's quantity-based price ladder as depth "bands" —
 * the signature visual for the whole site: the deeper the band, the
 * larger the quantity and the better the rate.
 */
export async function PriceTiers({
  tiers,
  unit,
  locale,
}: {
  tiers: PriceTier[];
  unit: Unit;
  locale: Locale;
}) {
  const { t } = await useI18nServer(locale);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {tiers.map((tier, i) => {
        const label = depthLabels[Math.min(i, depthLabels.length - 1)];
        const isDeepest = i === tiers.length - 1;
        const rangeText =
          tier.maxQty === null
            ? `${tier.minQty}+`
            : `${tier.minQty}–${tier.maxQty}`;

        return (
          <div
            key={i}
            className={`flex items-center justify-between gap-4 px-4 py-3.5 ${depthShades[Math.min(i, depthShades.length - 1)]} ${
              isDeepest ? "text-white" : "text-text"
            } ${i > 0 ? "border-t border-white/10" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-semibold uppercase tracking-wide ${isDeepest ? "text-white/70" : "text-text-muted"}`}>
                {t(`home.depthLayers.${label}`)}
              </span>
              <span className="tabular text-sm font-medium">
                {rangeText} {t(`units.${unit}`)}
              </span>
            </div>
            {tier.pricePerUnit !== null ? (
              <span className="tabular font-semibold">
                {t("common.egp")} {formatEGP(tier.pricePerUnit, locale)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-accent">{t("common.requestQuote")}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
