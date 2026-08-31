"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container } from "@/components/ui/primitives";
import { TextField } from "@/components/ui/form-fields";
import { Button, LinkButton } from "@/components/ui/button";

export default function RegisterPage() {
  const { t, locale } = useI18n();

  return (
    <Container className="max-w-md py-16">
      <h1 className="font-display text-2xl font-bold text-text">{t("auth.registerTitle")}</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6"
      >
        <TextField label={t("auth.name")} required />
        <TextField label={t("auth.phone")} type="tel" dir="ltr" required />
        <TextField label={t("auth.email")} type="email" dir="ltr" required />
        <TextField label={t("auth.password")} type="password" dir="ltr" required />
        <TextField label={t("auth.confirmPassword")} type="password" dir="ltr" required />
        <Button type="submit" className="w-full">
          {t("auth.registerButton")}
        </Button>
        <p className="rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-text-muted">
          {t("auth.comingSoonNotice")}
        </p>
      </form>

      <p className="mt-4 text-center text-sm text-text-muted">
        {t("auth.haveAccount")}{" "}
        <LinkButton href={`/${locale}/login`} variant="ghost" size="sm">
          {t("nav.login")}
        </LinkButton>
      </p>
    </Container>
  );
}
