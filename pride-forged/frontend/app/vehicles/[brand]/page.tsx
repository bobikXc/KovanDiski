import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/EmptyState";
import { ModelCard } from "@/components/vehicles/ModelCard";
import { ApiRequestError } from "@/lib/api";
import { getBrandCached, safeGetBrand } from "@/lib/server-api";

export const dynamic = "force-dynamic";

type BrandPageProps = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params;

  try {
    const brand = await getBrandCached(brandSlug);
    return {
      title: `Диски для ${brand.name} — PRIDE Forged`,
      description: `Каталог моделей ${brand.name} для подбора кованых дисков PRIDE Forged по fitment.`,
      openGraph: {
        title: `Диски PRIDE Forged для ${brand.name}`,
        description: `Выберите модель ${brand.name} и посмотрите подходящие кованые диски.`,
        type: "website",
        url: `/vehicles/${brand.slug}`
      }
    };
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    console.error(error);
    return { title: "Марка автомобиля — PRIDE Forged" };
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand: brandSlug } = await params;

  try {
    const brand = await safeGetBrand(brandSlug);

    if (!brand) {
      return (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/vehicles" className="text-sm text-accent">← Все марки</Link>
            <div className="mt-12">
              <EmptyState title="Марки автомобилей временно недоступны" description="Попробуйте обновить страницу или откройте раздел позже." />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/vehicles" className="text-sm text-accent">← Все марки</Link>
          <h1 className="mt-5 text-5xl font-black">Диски для {brand.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-graphite">
            Выберите модель автомобиля, чтобы увидеть подходящие диски из таблицы Fitment.
          </p>
          {(brand.models ?? []).length === 0 ? (
            <div className="mt-12">
              <EmptyState title="Моделей пока нет" description="Для этой марки backend не вернул модели автомобилей." />
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brand.models?.map((model) => <ModelCard key={model.slug} brand={brand} model={model} />)}
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }
}
