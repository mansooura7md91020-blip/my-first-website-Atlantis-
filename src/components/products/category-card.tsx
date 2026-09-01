import Link from "next/link";
import Image from "next/image";
import { Category, Locale } from "@/lib/types";

export function CategoryCard({ category, locale }: { category: Category; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className="card-shadow card-shadow-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="relative aspect-[4/3] bg-surface-muted">
        <Image
          src={category.image}
          alt={category.name[locale]}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 20vw, 50vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-text">{category.name[locale]}</h3>
        <p className="mt-1 text-sm text-text-muted line-clamp-2">{category.description[locale]}</p>
      </div>
    </Link>
  );
}
