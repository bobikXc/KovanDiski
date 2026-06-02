import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getWheelImage } from "@/components/catalog/WheelCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiRequestError, getFitments, getWheel } from "@/lib/api";

export const dynamic = "force-dynamic";

type WheelPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: WheelPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const wheel = await getWheel(slug);
    return {
      title: `${wheel.name} — каталог PRIDE Forged`,
      description: `${wheel.name}: ${wheel.diameter}″, ${wheel.width}J, ET${wheel.et}, PCD ${wheel.pcd}. ${wheel.description}`,
      openGraph: {
        title: `${wheel.name} — PRIDE Forged`,
        description: `Кованый диск ${wheel.name}: параметры, цена и совместимость.`,
        type: "website",
        url: `/catalog/${wheel.slug}`,
        images: [{ url: getWheelImage(wheel), alt: wheel.name }]
      }
    };
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    console.error(error);
    return { title: "Диск PRIDE Forged" };
  }
}

export default async function WheelPage({ params }: WheelPageProps) {
  const { slug } = await params;

  try {
    const [wheel, fitments] = await Promise.all([getWheel(slug), getFitments({ wheelSlug: slug })]);
    const specs = [
      ["Диаметр", `${wheel.diameter}″`],
      ["Ширина", `${wheel.width}J`],
      ["ET", wheel.et],
      ["PCD", wheel.pcd],
      ["DIA", wheel.dia],
      ["Вес", `${wheel.weight} кг`]
    ];

    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="mesh-card relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.18),transparent_45%)]" />
            <Image
              src={getWheelImage(wheel)}
              alt={`Кованый диск ${wheel.name}`}
              width={1000}
              height={1000}
              className="relative h-[78%] w-[78%] object-contain drop-shadow-[0_30px_65px_rgba(0,0,0,0.45)]"
              priority
            />
          </div>
          <div>
            <Link href="/catalog" className="text-sm text-accent">← Назад в каталог</Link>
            <h1 className="mt-5 text-5xl font-black">{wheel.name}</h1>
            <p className="mt-6 text-lg leading-8 text-white/68">{wheel.description}</p>
            <p className="mt-8 text-3xl font-black">от {Number(wheel.price).toLocaleString("ru-RU")} ₽</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {specs.map(([label, value]) => (
                <Card key={label} className="p-5">
                  <p className="text-sm text-white/50">{label}</p>
                  <p className="mt-2 text-xl font-bold">{value}</p>
                </Card>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8"><Link href="/contact">Запросить расчет</Link></Button>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl">
          <h2 className="text-3xl font-black">Совместимость Fitment</h2>
          {fitments.length === 0 ? (
            <p className="mt-4 text-white/60">Для этой модели пока нет привязанных автомобилей.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fitments.map((fitment) => (
                <Card key={fitment.id} className="p-5">
                  <p className="text-lg font-bold">{fitment.vehicle_model.name}</p>
                  <p className="mt-2 text-sm text-white/60">Проверенный fitment из FastAPI backend</p>
                </Card>
              ))}
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
