"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container } from "@/components/ui/primitives";
export default function RegisterPage() {
  const { locale } = useI18n();
  return <Container className="max-w-2xl py-20 text-center"><h1 className="text-2xl font-bold text-text">{locale === "ar" ? "إنشاء حساب عميل" : "Customer registration"}</h1>
  <p className="mt-4 text-text-muted">{locale === "ar" ? "ميزة حسابات العملاء لم تتفعل بعد؛ تقدر ترسل طلبك بدون حساب من صفحة المنتجات أو طلب توريد." : "Customer registration is not enabled. Orders and supply requests can be submitted without an account."}</p>
  <Link className="mt-6 inline-block rounded-lg bg-brand px-4 py-3 text-white" href={`/${locale}/products`}>{locale === "ar" ? "تصفح المنتجات" : "Browse products"}</Link>
  </Container>;
}
