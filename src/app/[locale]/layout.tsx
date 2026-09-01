import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDirection, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { ThemeProvider } from "@/lib/context/theme-context";
import { CartProvider } from "@/lib/context/cart-context";

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

/**
 * Root layout for BOTH the public site and /admin — provides <html>/<body>,
 * language direction, and the app-wide providers (i18n, theme, cart).
 * Visual chrome (header/footer for the public site, sidebar for admin)
 * lives one level down in each route group's own layout, so admin no
 * longer inherits the public Header/Footer — see (site)/layout.tsx and
 * admin/layout.tsx.
 */
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
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="min-h-screen bg-bg font-body text-text antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <ThemeProvider>
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
