import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { FacebookButton } from "@/components/layout/facebook-button";
import { getCompanySettings } from "@/lib/data/company-settings";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const settings = await getCompanySettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header companyNameAr={settings.legalName.ar} brandName={settings.brandName} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} message={settings.whatsappTemplates.generalInquiry[locale]} />
      {settings.facebookUrl && <FacebookButton url={settings.facebookUrl} locale={locale} />}
    </div>
  );
}
