import Link from "next/link";
import { getDictionary } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { CompanySettings } from "@/lib/types";
import { Logo } from "@/components/layout/logo";
import { categories } from "@/lib/data/categories";
import { Container } from "@/components/ui/primitives";

export async function Footer({ locale, settings }: { locale: Locale; settings: CompanySettings }) {
  const dict = await getDictionary(locale);
  const t = (key: string) =>
    key.split(".").reduce<any>((acc, k) => acc?.[k], dict) ?? key;

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo companyNameAr={settings.legalName.ar} brandName={settings.brandName} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
            {locale === "ar" ? settings.legalName.ar : settings.legalName.en}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link href={`/${locale}/products`} className="hover:text-text">{t("nav.products")}</Link></li>
            <li><Link href={`/${locale}/supply-request`} className="hover:text-text">{t("nav.supplyRequest")}</Link></li>
            <li><Link href={`/${locale}/about`} className="hover:text-text">{t("nav.about")}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-text">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text">{t("footer.categories")}</h3>
          <ul className="space-y-2 text-sm text-text-muted">
            {categories.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link href={`/${locale}/categories/${c.slug}`} className="hover:text-text">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text">{t("footer.contact")}</h3>
          <ul className="space-y-2 text-sm text-text-muted">
            <li dir="ltr" className="text-end">{settings.phone}</li>
            <li>{settings.email}</li>
            <li>{settings.salesRepresentative.name}</li>
            {settings.facebookUrl && (
              <li>
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-text">
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.brandName} — {t("footer.rights")}
          </p>
          <p className="text-accent-strong">{t("footer.demoNotice")}</p>
        </Container>
      </div>
    </footer>
  );
}
