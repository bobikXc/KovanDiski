import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WheelCard, formatWheelPrice, getWheelImageOrFallback } from "@/components/catalog/WheelCard";
import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { ApiRequestError, getFitments, getWheel, getWheels } from "@/lib/api";

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
        images: [{ url: getWheelImageOrFallback(wheel), alt: wheel.name }]
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
    const [wheel, fitments, wheels] = await Promise.all([getWheel(slug), getFitments({ wheelSlug: slug }), getWheels()]);
    const related = wheels.filter((item) => item.slug !== wheel.slug).slice(0, 3);
    const specs = [
      ["Диаметр", `${wheel.diameter}″`],
      ["Ширина", `${wheel.width}J`],
      ["ET", wheel.et],
      ["PCD", wheel.pcd],
      ["DIA", wheel.dia],
      ["Вес", `${wheel.weight} кг`]
    ];

    return (
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -right-40 top-16 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-[-18rem] top-80 -z-10 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <LiquidCard className="mesh-card relative flex min-h-[440px] items-center justify-center overflow-hidden rounded-[2rem] p-4 sm:min-h-[560px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(244,247,251,0.16),transparent_42%)]" />
            <div className="absolute inset-x-16 bottom-16 h-12 rounded-full bg-black/45 blur-3xl" />
            <div className="relative aspect-square w-full max-w-[620px] overflow-hidden rounded-full">
              <Image
                src={getWheelImageOrFallback(wheel)}
                alt={`Кованый диск ${wheel.name}`}
                fill
                sizes="(min-width: 1024px) 48vw, 92vw"
                className="object-contain object-center drop-shadow-[0_30px_65px_rgba(0,0,0,0.42)]"
                priority
              />
            </div>
          </LiquidCard>

          <div className="relative">
            <Link href="/catalog" className="text-sm font-semibold text-accent transition hover:text-primary">Назад в каталог</Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-accent">Forged wheel</p>
            <h1 className="mt-4 text-5xl font-black leading-none text-primary sm:text-7xl">{wheel.name}</h1>
            <p className="mt-6 text-lg leading-8 text-graphite">{wheel.description}</p>
            <LiquidCard className="mt-8 rounded-2xl p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-graphite/45">Цена</p>
              <p className="mt-2 text-3xl font-black text-primary">{formatWheelPrice(wheel.price)}</p>
            </LiquidCard>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {specs.map(([label, value]) => (
                <LiquidCard key={label} className="rounded-2xl p-5">
                  <p className="text-sm text-graphite/50">{label}</p>
                  <p className="mt-2 text-xl font-bold">{value}</p>
                </LiquidCard>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8 w-full sm:w-auto"><Link href="/contact">Получить консультацию</Link></Button>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl">
          <LiquidCard className="rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Fitment</p>
                <h2 className="mt-3 text-3xl font-black text-primary sm:text-5xl">Подходит для</h2>
              </div>
              <Button asChild variant="outline"><Link href="/fitment">Подобрать по автомобилю</Link></Button>
            </div>
            {fitments.length === 0 ? (
              <p className="mt-6 text-graphite">Для этой модели пока нет привязанных автомобилей. Специалист PRIDE проверит параметры под ваш кузов вручную.</p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fitments.map((fitment) => (
                  <LiquidCard key={fitment.id} interactive className="rounded-2xl p-5">
                    <p className="text-lg font-bold text-primary">{fitment.vehicle_model.name}</p>
              <p className="mt-2 text-sm text-graphite/70">Проверенный fitment из FastAPI backend</p>
                  </LiquidCard>
                ))}
              </div>
            )}
          </LiquidCard>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-14 max-w-7xl">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">PRIDE selection</p>
                <h2 className="mt-3 text-3xl font-black text-primary sm:text-5xl">Похожие модели</h2>
              </div>
              <Button asChild variant="outline"><Link href="/catalog">Весь каталог</Link></Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => <WheelCard key={item.slug} wheel={item} index={index} />)}
            </div>
          </div>
        )}
      </section>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }
}
