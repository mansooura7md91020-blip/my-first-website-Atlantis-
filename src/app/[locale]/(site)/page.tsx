import { Locale } from "@/lib/types";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useI18nServer } from "@/lib/i18n/server-t";
import { Container, SectionHeading, Badge } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductCard } from "@/components/products/product-card";
import { CategoryCard } from "@/components/products/category-card";

const sectorKeys = ["restaurants", "cafes", "schools", "hospitals", "universities", "companies"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { t } = await useI18nServer(locale);
  const [featured, categories] = await Promise.all([getFeaturedProducts(4), getCategories()]);

  return (
    <>
      {/* HERO — fixed dark teal band regardless of theme, for a consistent premium first screen */}
      <section className="relative overflow-hidden bg-[var(--blue-900)]">
        <HeroBackdrop />
        <Container className="relative z-10 grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <Badge tone="accent" className="mb-5">
              {t("home.heroEyebrow")}
            </Badge>
            <h1 className="font-display max-w-xl text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-[2.75rem]">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
              {t("home.heroSubtitle")}
            </p>
            <p className="mt-3 text-sm text-white/55">
              <span className="font-semibold text-white/75">{t("home.heroServingLabel")}: </span>
              {t("home.heroServingList")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href={`/${locale}/products`} variant="accent" size="lg">
                {t("home.ctaShop")}
              </LinkButton>
              <LinkButton
                href={`/${locale}/supply-request`}
                variant="outline"
                size="lg"
                className="border-white/25 text-white hover:bg-white/10"
              >
                {t("home.ctaSupply")}
              </LinkButton>
              <Link
                href={`/${locale}/contact`}
                className="text-sm font-medium text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
              >
                {t("nav.contact")}
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {(
                [
                  ["10+", locale === "ar" ? "تصنيف منتجات" : "Product categories"],
                  ["4", locale === "ar" ? "مستويات تسعير" : "Pricing tiers"],
                  ["24h", locale === "ar" ? "زمن الرد" : "Response time"],
                ] as const
              ).map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display tabular text-xl font-bold text-white">{value}</dt>
                  <dd className="mt-0.5 text-xs text-white/55">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroDropletArt />
        </Container>
      </section>

      {/* SECTORS */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading title={t("home.sectorsTitle")} subtitle={t("home.sectorsSubtitle")} align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sectorKeys.map((key) => (
              <div
                key={key}
                className="card-shadow-hover flex flex-col items-center gap-2.5 rounded-xl border border-border bg-surface p-5 text-center"
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
            <div className="card-shadow rounded-2xl border border-border bg-surface p-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                <CartOutlineIcon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-text">{t("home.shopTitle")}</h3>
              <p className="mt-2 text-text-muted leading-relaxed">{t("home.shopBody")}</p>
              <LinkButton href={`/${locale}/products`} variant="primary" className="mt-6">
                {t("home.ctaShop")}
              </LinkButton>
            </div>
            <div className="card-shadow rounded-2xl border border-accent/30 bg-surface p-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                <DocOutlineIcon className="h-5 w-5" />
              </div>
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
                  backgroundColor: ["#2c80b8", "#1f6699", "#17507f", "#0d2c49"][i],
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.12)" : undefined,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-white/65">
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
      <section className="bg-[var(--blue-900)] py-14 text-white sm:py-20">
        <Container>
          <SectionHeading title={t("home.whyTitle")} align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(["why1", "why2", "why3"] as const).map((key) => (
              <div key={key} className="rounded-xl border border-white/12 bg-white/[0.04] p-6">
                <h3 className="font-display font-semibold">{t(`home.${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{t(`home.${key}Body`)}</p>
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
              <li key={key} className="card-shadow-hover rounded-xl border border-border bg-surface p-6">
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

function HeroBackdrop() {
  // Faint repeating droplet motif — echoes the logo mark without competing with the headline.
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {[80, 260, 440, 620, 760].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${20 + (i % 2) * 200}c14 16 25 29 25 42a25 25 0 0 1-50 0c0-13 11-26 25-42Z`}
          fill="white"
        />
      ))}
    </svg>
  );
}

function HeroDropletArt() {
  // Large-scale version of the logo's droplet-shield + leaf-stem + sparkle motif.
  return (
    <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-md lg:block">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect x="60" y="30" width="280" height="240" rx="20" fill="rgba(255,255,255,0.04)" />
        <path
          d="M200 60c46 52 80 94 80 134a80 80 0 0 1-160 0c0-40 34-82 80-134Z"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="4"
        />
        <path d="M200 118v96M162 166h76" stroke="rgba(255,255,255,0.65)" strokeWidth="5" strokeLinecap="round" />
        <path d="M252 96c18 0 28 11 28 28-18 0-28-11-28-28Z" fill="#4fc17e" />
      </svg>
    </div>
  );
}

function SectorIcon({ sector }: { sector: (typeof sectorKeys)[number] }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d={sectorPaths[sector]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h8a2 2 0 0 0 2-1.6L20 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function DocOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
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
