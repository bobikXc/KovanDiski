import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WheelCard, getWheelImageOrFallback } from "@/components/catalog/WheelCard";
import { WheelDetailGallery } from "@/components/catalog/wheel-detail-gallery";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ApiRequestError } from "@/lib/api";
import { normalizeWheelImages } from "@/lib/assets";
import { getSiteData, getWheelCached, safeGetWheel } from "@/lib/server-api";

export const dynamic = "force-dynamic";

type WheelPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: WheelPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const wheel = await getWheelCached(slug);
    return {
      title: `${wheel.name} - каталог PRIDE Forged`,
      description: `${wheel.name}: ${wheel.diameter}″, ${wheel.width}J, ET${wheel.et}, PCD ${wheel.pcd}. ${wheel.description}`,
      openGraph: {
        title: `${wheel.name} - PRIDE Forged`,
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
    const wheel = await safeGetWheel(slug);

    if (!wheel) {
      return (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/catalog" className="text-sm font-semibold text-accent transition hover:text-primary">Назад в каталог</Link>
            <div className="mt-12">
              <EmptyState title="Карточка диска временно недоступна" description="Сервис временно перегружен. Попробуйте обновить страницу или откройте каталог позже." />
            </div>
          </div>
        </section>
      );
    }

    const { wheels } = await getSiteData();
    const related = wheels.filter((item) => item.slug !== wheel.slug).slice(0, 3);
    const galleryImages = normalizeWheelImages(wheel);
    const description = wheel.description?.trim() || "Кованая модель PRIDE с выразительной геометрией и точной проработкой каждой детали. Дизайн и параметры адаптируются под конкретный автомобиль и характер проекта.";
    const availableSizes = [19, 20, 21, 22, 23, 24].map((size) => `${size}″`).join("  |  ");

    return (
      <section className="wheel-detail-page">
        <div className="wheel-detail-shell">
          <nav className="wheel-breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link><span aria-hidden="true">/</span>
            <Link href="/catalog">Каталог</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{wheel.name}</span>
          </nav>

          <div className="wheel-detail-layout">
            <WheelDetailGallery images={galleryImages} title={wheel.name} />

            <aside className="wheel-detail-info">
              <p className="wheel-detail-kicker">PRIDE FORGED</p>
              <h1>{wheel.name}</h1>
              <p className="wheel-detail-description">{description}</p>

              <div className="wheel-detail-sizes">
                <span>Доступные диаметры</span>
                <p>{availableSizes}</p>
                <small>Ширина, вылет и посадочные параметры рассчитываются индивидуально под автомобиль.</small>
              </div>

              <Button asChild size="lg" className="wheel-detail-cta">
                <Link href="/contact">Получить предложение</Link>
              </Button>
            </aside>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
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
