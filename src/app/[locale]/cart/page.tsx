"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { products } from "@/lib/data/products";
import { resolvePrice, formatEGP } from "@/lib/utils/pricing";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Button, LinkButton } from "@/components/ui/button";

export default function CartPage() {
  const { t, locale } = useI18n();
  const { lines, updateQuantity, removeItem } = useCart();

  const rows = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          if (!product) return null;
          const price = resolvePrice(product.priceTiers, line.quantity);
          return { line, product, price };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [lines]
  );

  const hasQuoteRequired = rows.some((r) => r.price.requiresQuote);
  const subtotal = rows.reduce((sum, r) => sum + (r.price.lineTotal ?? 0), 0);

  if (rows.length === 0) {
    return (
      <Container className="py-16 text-center">
        <SectionHeading title={t("cart.title")} align="center" />
        <p className="mt-4 text-text-muted">{t("cart.empty")}</p>
        <p className="text-text-muted">{t("cart.emptyBody")}</p>
        <LinkButton href={`/${locale}/products`} className="mt-6">
          {t("cart.continueShopping")}
        </LinkButton>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("cart.title")} />

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {rows.map(({ line, product, price }) => (
            <div key={product.id} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={product.images[0]} alt={product.name[locale]} fill className="object-contain p-2" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/${locale}/products/${product.slug}`} className="font-medium text-text hover:underline">
                      {product.name[locale]}
                    </Link>
                    {price.requiresQuote && (
                      <p className="mt-1 text-xs font-medium text-accent-strong">{t("common.requiresQuote")}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs text-danger hover:underline"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text"
                      onClick={() => updateQuantity(product.id, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="tabular w-10 text-center text-sm">{line.quantity}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text"
                      onClick={() => updateQuantity(product.id, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  {price.lineTotal !== null && (
                    <span className="tabular font-semibold text-brand-strong">
                      {t("common.egp")} {formatEGP(price.lineTotal, locale)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-border bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <span className="text-text-muted">{t("common.subtotal")}</span>
            <span className="tabular text-lg font-bold text-brand-strong">
              {t("common.egp")} {formatEGP(subtotal, locale)}
            </span>
          </div>

          {hasQuoteRequired && (
            <p className="mt-4 rounded-lg bg-accent/10 p-3 text-xs leading-relaxed text-accent-strong">
              {t("cart.quoteNeededNotice")}
            </p>
          )}

          <LinkButton
            href={`/${locale}/checkout`}
            className="mt-5 w-full"
            variant={hasQuoteRequired ? "secondary" : "primary"}
          >
            {t("cart.proceedToCheckout")}
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
