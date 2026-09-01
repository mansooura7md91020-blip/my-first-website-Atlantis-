import Link from "next/link";
import { getDictionary } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { CompanySettings } from "@/lib/types";
import { Logo } from "@/components/layout/logo";
import { categories } from "@/lib/data/categories";
import { Container } from "@/components/ui/primitives";

export async function Footer({ locale, settings }: { locale: Locale; settings: CompanySettings }) {
  const dict = await getDictionary(locale);
  const t = (key: string) => key.split(".").reduce<any>((acc, k) => acc?.[k], dict) ?? key;

  return (
    <footer className="mt-20 border-t border-border bg-[var(--teal-900)] text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo companyNameAr={settings.legalName.ar} brandName={settings.brandName} tone="on-brand" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {locale === "ar"
              ? "توريدات عمومية ومنتجات تنظيف للمطاعم والكافيهات والمدارس والمستشفيات والشركات."
              : "General supplies and cleaning products for restaurants, cafés, schools, hospitals and companies."}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href={`/${locale}/products`} className="transition-colors hover:text-white">{t("nav.products")}</Link></li>
            <li><Link href={`/${locale}/supply-request`} className="transition-colors hover:text-white">{t("nav.supplyRequest")}</Link></li>
            <li><Link href={`/${locale}/about`} className="transition-colors hover:text-white">{t("nav.about")}</Link></li>
            <li><Link href={`/${locale}/contact`} className="transition-colors hover:text-white">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("footer.categories")}</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {categories.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link href={`/${locale}/categories/${c.slug}`} className="transition-colors hover:text-white">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("footer.contact")}</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li className="font-medium text-white">{settings.salesRepresentative.name}</li>
            <li dir="ltr" className="text-end sm:text-start">{settings.phone}</li>
            <li dir="ltr" className="text-end sm:text-start">{settings.email}</li>
            {settings.facebookUrl && (
              <li>
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.brandName} — {t("footer.rights")}
          </p>
          <p className="text-accent">{t("footer.demoNotice")}</p>
        </Container>
      </div>
    </footer>
  );
}
