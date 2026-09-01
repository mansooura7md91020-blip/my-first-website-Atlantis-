"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, Locale } from "@/lib/types";
import { getStartingPrice, formatEGP } from "@/lib/utils/pricing";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Badge } from "@/components/ui/primitives";

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const { t } = useI18n();
  const startingPrice = getStartingPrice(product);
  const hasBulkTiers = product.priceTiers.length > 1;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="card-shadow card-shadow-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <Image
          src={product.images[0]}
          alt={product.name[locale]}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        {product.isDemo && (
          <Badge tone="accent" className="absolute top-2.5 start-2.5">
            DEMO
          </Badge>
        )}
        {!product.inStock && (
          <Badge tone="danger" className="absolute top-2.5 end-2.5">
            {t("common.outOfStock")}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-medium text-text line-clamp-2">{product.name[locale]}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{product.shortDescription[locale]}</p>

        {hasBulkTiers && (
          <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-strong">
            <TierIcon className="h-3 w-3" />
            {t("products.bulkAvailable")}
          </span>
        )}

        <div className="mt-auto flex items-baseline justify-between pt-3">
          {startingPrice !== null ? (
            <p className="tabular font-semibold text-brand-strong">
              <span className="text-xs font-normal text-text-muted">{t("products.startingFrom")} </span>
              {t("common.egp")} {formatEGP(startingPrice, locale)}
              <span className="ms-1 text-xs font-normal text-text-muted">/ {t(`units.${product.unit}`)}</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-accent-strong">{t("common.requestQuote")}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function TierIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 17h4v4H3zM10 11h4v10h-4zM17 5h4v16h-4z" fill="currentColor" />
    </svg>
  );
}
