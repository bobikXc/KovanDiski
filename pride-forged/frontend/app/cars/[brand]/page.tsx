import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getBrand } from "@/lib/api";

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const brand = await getBrand(brandSlug);
  if (!brand) notFound();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/cars" className="text-sm text-accent">← Все марки</Link>
        <h1 className="mt-5 text-5xl font-black">Диски для {brand.name}</h1>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(brand.models ?? []).map((model) => (
            <Link key={model.slug} href={`/cars/${brand.slug}/${model.slug}`}>
              <Card className="p-7 transition hover:-translate-y-1 hover:border-accent/60">
                <p className="text-2xl font-black">{model.name}</p>
                <p className="mt-3 text-white/60">Fitment {model.year_from ?? 2019}+</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
