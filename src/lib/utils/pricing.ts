import { PriceTier, Product } from "@/lib/types";

export interface PriceResult {
  /** Price per single unit at this quantity, or null if a quote is required. */
  unitPrice: number | null;
  /** unitPrice * quantity, or null if a quote is required. */
  lineTotal: number | null;
  tier: PriceTier | null;
  requiresQuote: boolean;
}

/**
 * Resolves which tier a given quantity falls into and computes the total.
 * This is the single function that should be used anywhere a price is shown
 * or a cart line total is computed, so pricing logic never lives twice.
 */
export function resolvePrice(tiers: PriceTier[], quantity: number): PriceResult {
  const tier = tiers.find(
    (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );

  if (!tier || tier.pricePerUnit === null) {
    return { unitPrice: null, lineTotal: null, tier: tier ?? null, requiresQuote: true };
  }

  return {
    unitPrice: tier.pricePerUnit,
    lineTotal: tier.pricePerUnit * quantity,
    tier,
    requiresQuote: false,
  };
}

export function getStartingPrice(product: Product): number | null {
  const firstPriced = product.priceTiers.find((t) => t.pricePerUnit !== null);
  return firstPriced?.pricePerUnit ?? null;
}

export function formatEGP(amount: number, locale: "ar" | "en"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    maximumFractionDigits: 2,
  }).format(amount);
}
