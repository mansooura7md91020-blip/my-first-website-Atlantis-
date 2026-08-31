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

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <Image
          src={product.images[0]}
          alt={product.name[locale]}
          fill
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        {product.isDemo && (
          <Badge tone="accent" className="absolute top-2 start-2">
            DEMO
          </Badge>
        )}
        {!product.inStock && (
          <Badge tone="danger" className="absolute top-2 end-2">
            {t("common.outOfStock")}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-medium text-text line-clamp-2">{product.name[locale]}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{product.shortDescription[locale]}</p>
        <div className="mt-auto flex items-baseline justify-between pt-3">
          {startingPrice !== null ? (
            <p className="tabular font-semibold text-brand-strong">
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
