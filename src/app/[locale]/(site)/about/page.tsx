import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { Locale } from "@/lib/types";
import { useI18nServer } from "@/lib/i18n/server-t";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { getCompanySettings } from "@/lib/data/company-settings";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { t } = await useI18nServer(locale);
  const settings = await getCompanySettings();

  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <SectionHeading title={t("about.title")} />
      <p className="mt-6 leading-relaxed text-text-muted">{t("about.intro")}</p>

      <div className="mt-10">
        <h2 className="mb-2 text-lg font-semibold text-text">{t("about.missionTitle")}</h2>
        <p className="leading-relaxed text-text-muted">{t("about.missionBody")}</p>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 text-lg font-semibold text-text">{t("about.repTitle")}</h2>
        <p className="text-text-muted">{t("about.repBody")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-medium text-text">{settings.salesRepresentative.name}</span>
          <span dir="ltr" className="text-text-muted">
            {settings.salesRepresentative.phone}
          </span>
          <WhatsAppButton
            phone={settings.whatsapp}
            message={settings.whatsappTemplates.generalInquiry[locale]}
            floating={false}
          />
        </div>
      </div>
    </Container>
  );
}
