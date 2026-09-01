import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
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
  const locale = rawLocale;

  const settings = await getCompanySettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header companyNameAr={settings.legalName.ar} brandName={settings.brandName} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} message={settings.whatsappTemplates.generalInquiry[locale]} />
    </div>
  );
}
