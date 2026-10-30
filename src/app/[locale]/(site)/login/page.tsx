"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container } from "@/components/ui/primitives";
export default function LoginPage() {
  const { locale } = useI18n();
  return <Container className="max-w-2xl py-20 text-center"><h1 className="text-2xl font-bold text-text">{locale === "ar" ? "الدخول لحساب العميل" : "Customer sign-in"}</h1>
  <p className="mt-4 text-text-muted">{locale === "ar" ? "حسابات العملاء لم يتم تفعيلها بعد. اطلب مباشرة من الموقع بدون تسجيل. مدير الموقع يستخدم صفحة دخول منفصلة وآمنة." : "Customer accounts are not enabled yet. You can order without signing in. Staff have a separate login."}</p>
  <Link className="mt-6 inline-block rounded-lg bg-brand px-4 py-3 text-white" href={`/${locale}/products`}>{locale === "ar" ? "تصفح المنتجات" : "Browse products"}</Link>
  </Container>;
}
