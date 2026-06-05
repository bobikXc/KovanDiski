import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WheelCard } from "@/components/catalog/WheelCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ApiRequestError, getBrand, getFitments } from "@/lib/api";

export const dynamic = "force-dynamic";

type ModelPageProps = { params: Promise<{ brand: string; model: string }> };

async function getModelContext(brandSlug: string, modelSlug: string) {
  const brand = await getBrand(brandSlug);
  const model = brand.models?.find((item) => item.slug === modelSlug);
  if (!model) notFound();
  return { brand, model };
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { brand: brandSlug, model: modelSlug } = await params;

  try {
    const { brand, model } = await getModelContext(brandSlug, modelSlug);
    return {
      title: `Диски для ${brand.name} ${model.name} — PRIDE Forged`,
      description: `Подходящие кованые диски PRIDE Forged для ${brand.name} ${model.name} из Fitment backend.`,
      openGraph: {
        title: `PRIDE Forged для ${brand.name} ${model.name}`,
        description: "Проверенные диски по fitment с характеристиками и переходом в карточку.",
        type: "website",
        url: `/vehicles/${brand.slug}/${model.slug}`
      }
    };
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    console.error(error);
    return { title: "Подбор дисков — PRIDE Forged" };
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { brand: brandSlug, model: modelSlug } = await params;

  try {
    const [{ brand, model }, fitments] = await Promise.all([
      getModelContext(brandSlug, modelSlug),
      getFitments({ brandSlug, modelSlug })
    ]);

    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href={`/vehicles/${brand.slug}`} className="text-sm text-accent">← Назад к моделям</Link>
          <h1 className="mt-5 text-5xl font-black">PRIDE для {brand.name} {model.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-graphite/70">
            Подходящие диски загружены из endpoint Fitment. Точные параметры согласуем по тормозной системе, подвеске и желаемой посадке.
          </p>

          {fitments.length === 0 ? (
            <div className="mt-12">
              <EmptyState title="Подходящие диски не найдены" description="Для выбранной модели нет записей Fitment. Оставьте заявку — подберем индивидуальную посадку." />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fitments.map((fitment, index) => <WheelCard key={fitment.id} wheel={fitment.wheel} index={index} />)}
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
