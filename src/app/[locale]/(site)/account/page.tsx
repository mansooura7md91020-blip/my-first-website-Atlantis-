"use client";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { Container } from "@/components/ui/primitives";
import Link from "next/link";
export default function AccountPage() {
  const { locale } = useI18n();
  return <Container className="max-w-3xl py-20 text-center"><h1 className="text-2xl font-bold text-text">{locale === "ar" ? "حساب العميل" : "Customer account"}</h1>
    <p className="mt-4 text-text-muted">{locale === "ar" ? "إنشاء حسابات العملاء ومتابعة الطلبات من خلالها لم يتم تفعيلهما بعد. يمكنك طلب المنتجات بدون حساب، وسيتم مراجعة الطلب والتواصل معك مباشرة." : "Customer account login and private order tracking are not enabled yet. You can submit an order as a guest."}</p>
    <Link className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-white" href={`/${locale}/products`}>{locale === "ar" ? "تصفح المنتجات" : "Browse products"}</Link>
  </Container>;
}
