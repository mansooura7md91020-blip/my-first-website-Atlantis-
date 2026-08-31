import { Locale } from "@/lib/types";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { useI18nServer } from "@/lib/i18n/server-t";
import { Container, SectionHeading, Badge } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductCard } from "@/components/products/product-card";
import { CategoryCard } from "@/components/products/category-card";
import { getCompanySettings } from "@/lib/data/company-settings";

const sectorKeys = ["restaurants", "cafes", "schools", "hospitals", "universities", "companies"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { t } = await useI18nServer(locale);
  const [featured, categories, settings] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
    getCompanySettings(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-strong">
        <Container className="relative z-10 grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <Badge tone="accent" className="mb-4">
              {t("home.heroEyebrow")}
            </Badge>
            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={`/${locale}/products`} variant="accent" size="lg">
                {t("home.ctaShop")}
              </LinkButton>
              <LinkButton
                href={`/${locale}/supply-request`}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {t("home.ctaSupply")}
              </LinkButton>
            </div>
          </div>
          <DepthHeroArt />
        </Container>
        <WaveDivider />
      </section>

      {/* SECTORS */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={undefined}
            title={t("home.sectorsTitle")}
            subtitle={t("home.sectorsSubtitle")}
            align="center"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sectorKeys.map((key) => (
              <div
                key={key}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-5 text-center"
              >
                <SectorIcon sector={key} />
                <span className="text-sm font-medium text-text">{t(`home.sectors.${key}`)}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TWO WAYS TO ORDER */}
      <section className="bg-surface-muted py-14 sm:py-20">
        <Container>
          <SectionHeading title={t("home.howItWorksTitle")} subtitle={t("home.howItWorksSubtitle")} align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <h3 className="font-display text-xl font-semibold text-text">{t("home.shopTitle")}</h3>
              <p className="mt-2 text-text-muted leading-relaxed">{t("home.shopBody")}</p>
              <LinkButton href={`/${locale}/products`} variant="primary" className="mt-6">
                {t("home.ctaShop")}
              </LinkButton>
            </div>
            <div className="rounded-2xl border border-accent/40 bg-surface p-8">
              <h3 className="font-display text-xl font-semibold text-text">{t("home.supplyTitle")}</h3>
              <p className="mt-2 text-text-muted leading-relaxed">{t("home.supplyBody")}</p>
              <LinkButton href={`/${locale}/supply-request`} variant="accent" className="mt-6">
                {t("home.ctaSupply")}
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      {/* DEPTH PRICING EXPLAINER */}
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading title={t("home.depthTitle")} subtitle={t("home.depthSubtitle")} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            {(["surface", "reef", "deep", "abyss"] as const).map((label, i) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-4 text-white"
                style={{
                  background: `color-mix(in srgb, var(--brand-strong) ${30 + i * 22}%, var(--surface))`,
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.12)" : undefined,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  {t(`home.depthLayers.${label}`)}
                </span>
                <span className="tabular text-sm font-medium">
                  {i < 3 ? `${[1, 100, 500][i]}–${[99, 499, 999][i]}` : "1000+"}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-surface-muted py-14 sm:py-20">
        <Container>
          <div className="flex items-end justify-between">
            <SectionHeading title={t("home.featuredTitle")} />
            <LinkButton href={`/${locale}/products`} variant="ghost" size="sm" className="hidden sm:inline-flex">
              {t("common.viewAll")}
            </LinkButton>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading title={t("home.categoriesTitle")} />
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-5">
            {categories.slice(0, 5).map((c) => (
              <CategoryCard key={c.id} category={c} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      {/* WHY US */}
      <section className="bg-brand-strong py-14 text-white sm:py-20">
        <Container>
          <SectionHeading title={t("home.whyTitle")} align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(["why1", "why2", "why3"] as const).map((key) => (
              <div key={key} className="rounded-xl border border-white/15 bg-white/5 p-6">
                <h3 className="font-display font-semibold">{t(`home.${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{t(`home.${key}Body`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PROCESS */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading title={t("home.processTitle")} align="center" />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(["process1", "process2", "process3", "process4"] as const).map((key, i) => (
              <li key={key} className="rounded-xl border border-border bg-surface p-6">
                <span className="font-display text-3xl font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-semibold text-text">{t(`home.${key}Title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{t(`home.${key}Body`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 60" className="wave-divider text-bg" preserveAspectRatio="none">
      <path fill="currentColor" d="M0 30 C 240 60 480 0 720 20 C 960 40 1200 60 1440 20 L1440 60 L0 60 Z" />
    </svg>
  );
}

function DepthHeroArt() {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
      <svg viewBox="0 0 320 320" className="h-full w-full">
        <circle cx="160" cy="160" r="150" fill="rgba(255,255,255,0.05)" />
        <circle cx="160" cy="160" r="110" fill="rgba(255,255,255,0.06)" />
        <circle cx="160" cy="160" r="70" fill="rgba(217,164,65,0.9)" />
        <path
          d="M20 200c30-24 60-24 90 0s60 24 90 0 60-24 90 0 60 24 90 0"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M20 240c30-24 60-24 90 0s60 24 90 0 60-24 90 0 60 24 90 0"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
}

function SectorIcon({ sector }: { sector: (typeof sectorKeys)[number] }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d={sectorPaths[sector]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const sectorPaths: Record<(typeof sectorKeys)[number], string> = {
  restaurants: "M6 3v7M9 3v7M6 10a2 2 0 0 0 3 0M17 3c-2 0-3 2-3 4s1 3 3 3v10",
  cafes: "M5 8h11v6a5 5 0 0 1-11 0V8Zm11 2h2a2 2 0 0 1 0 4h-2",
  schools: "M12 4 21 8l-9 4-9-4 9-4Zm-6 6v5c0 1.5 3 3 6 3s6-1.5 6-3v-5",
  hospitals: "M4 8h16v11H4zM12 11v5M9.5 13.5h5",
  universities: "M12 3 2 8l10 5 10-5-10-5ZM6 12v5c2 1.5 10 1.5 12 0v-5",
  companies: "M4 21V7l6-3 6 3v14M10 21v-6h4v6M4 21h16",
};
