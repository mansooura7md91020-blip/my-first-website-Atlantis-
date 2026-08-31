import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDirection, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { ThemeProvider } from "@/lib/context/theme-context";
import { CartProvider } from "@/lib/context/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getCompanySettings } from "@/lib/data/company-settings";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: { default: dict.meta.siteTitle, template: `%s · ${dict.meta.siteTitle}` },
    description: dict.meta.siteTagline,
  };
}

// Runs before paint to avoid a light/dark flash on first load.
const noFlashThemeScript = `
(function() {
  try {
    var stored = localStorage.getItem('atlantis_theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const settings = await getCompanySettings();
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="min-h-screen bg-bg font-body text-text antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <ThemeProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header companyNameAr={settings.legalName.ar} brandName={settings.brandName} />
                <main className="flex-1">{children}</main>
                <Footer locale={locale} settings={settings} />
              </div>
              <WhatsAppButton
                phone={settings.whatsapp}
                message={settings.whatsappTemplates.generalInquiry[locale]}
              />
            </CartProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
