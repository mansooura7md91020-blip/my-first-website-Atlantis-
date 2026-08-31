"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { resolvePrice, formatEGP } from "@/lib/utils/pricing";
import { useCart } from "@/lib/context/cart-context";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/button";

export function AddToCartForm({ product }: { product: Product }) {
  const { t, locale } = useI18n();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(product.minOrderQty);
  const [added, setAdded] = useState(false);

  const price = useMemo(() => resolvePrice(product.priceTiers, quantity), [product.priceTiers, quantity]);

  function changeQty(delta: number) {
    setQuantity((q) => Math.max(product.minOrderQty, q + delta));
    setAdded(false);
  }

  if (!product.inStock) {
    return (
      <div className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-muted">
        {t("common.outOfStock")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-text">{t("common.quantity")}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => changeQty(-1)}
              className="flex h-10 w-10 items-center justify-center text-lg text-text-muted hover:text-text"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              min={product.minOrderQty}
              onChange={(e) => {
                setQuantity(Math.max(product.minOrderQty, Number(e.target.value) || product.minOrderQty));
                setAdded(false);
              }}
              className="tabular w-16 border-x border-border bg-transparent py-2 text-center text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => changeQty(1)}
              className="flex h-10 w-10 items-center justify-center text-lg text-text-muted hover:text-text"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm text-text-muted">{t(`units.${product.unit}`)}</span>
        </div>
        <p className="mt-1.5 text-xs text-text-muted">
          {t("products.minOrder", { qty: product.minOrderQty, unit: t(`units.${product.unit}`) })}
        </p>
      </div>

      <div className="rounded-lg bg-surface-muted p-4">
        {price.requiresQuote ? (
          <p className="text-sm font-medium text-accent-strong">{t("common.requiresQuote")}</p>
        ) : (
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-text-muted">{t("common.total")}</span>
            <span className="tabular text-lg font-bold text-brand-strong">
              {t("common.egp")} {formatEGP(price.lineTotal!, locale)}
            </span>
          </div>
        )}
      </div>

      {price.requiresQuote ? (
        <LinkButton href={`/${locale}/supply-request`} variant="accent" className="w-full">
          {t("common.requestQuote")}
        </LinkButton>
      ) : (
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            addItem(product.id, quantity);
            setAdded(true);
          }}
        >
          {added ? "✓" : null} {t("common.addToCart")}
        </Button>
      )}
    </div>
  );
}
