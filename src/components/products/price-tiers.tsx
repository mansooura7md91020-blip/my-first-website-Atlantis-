import { Locale, PriceTier, Unit } from "@/lib/types";
import { formatEGP } from "@/lib/utils/pricing";
import { useI18nServer } from "@/lib/i18n/server-t";

const depthLabels = ["surface", "reef", "deep", "abyss"] as const;
// Fixed teal depth scale (independent of light/dark theme) so the
// "deeper = better price" visual always reads the same way.
const depthColors = ["#2c80b8", "#1f6699", "#17507f", "#0d2c49"];

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
        const rangeText = tier.maxQty === null ? `${tier.minQty}+` : `${tier.minQty}–${tier.maxQty}`;

        return (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-4 py-3.5 text-white"
            style={{
              backgroundColor: depthColors[Math.min(i, depthColors.length - 1)],
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.12)" : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/65">
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
              <span className="text-sm font-semibold text-accent-strong" style={{ color: "#7ad9a0" }}>
                {t("common.requestQuote")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
