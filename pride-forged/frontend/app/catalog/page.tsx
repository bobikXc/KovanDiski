import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CatalogWheelCard } from "@/components/catalog/CatalogWheelCard";
import { EmptyState } from "@/components/common/EmptyState";
import { sortWheelsByCatalogOrder } from "@/lib/assets";
import { getSiteData } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог дисков — PRIDE Forged",
  description: "Полный каталог премиальных кованых дисков PRIDE Forged с параметрами, ценами и карточками моделей.",
  openGraph: {
    title: "Каталог дисков — PRIDE Forged",
    description: "Выберите кованые диски PRIDE Forged по диаметру, ширине, ET, PCD и другим характеристикам.",
    type: "website",
    url: "/catalog"
  }
};

export default async function CatalogPage() {
  const { wheels: siteWheels } = await getSiteData();
  const wheels = sortWheelsByCatalogOrder(siteWheels);

  return (
    <section className="catalog-page">
      <div className="catalog-hero-media" aria-hidden="true">
        <Image
          src="/images/Bentley-Continental-GT-IV.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="catalog-hero-image"
        />
        <div className="catalog-hero-overlay" />
      </div>
      <div className="catalog-page-glow" aria-hidden="true" />
      <div className="catalog-shell">
        <header className="catalog-heading">
          <div>
            <p className="catalog-eyebrow">Коллекция PRIDE Forged</p>
            <h1>Каталог кованых дисков</h1>
          </div>
          <div className="catalog-heading-aside">
            <p>Индивидуальная геометрия, точная посадка и финиш под характер вашего автомобиля.</p>
            <Link href="/contact">Подобрать конфигурацию <span aria-hidden="true">↗</span></Link>
          </div>
        </header>

        {wheels.length === 0 ? (
          <div className="catalog-empty">
            <EmptyState title="Каталог временно недоступен" description="Попробуйте обновить страницу или откройте каталог позже." />
          </div>
        ) : (
          <div className="catalog-grid">
            {wheels.map((wheel) => <CatalogWheelCard key={wheel.slug} wheel={wheel} />)}
          </div>
        )}
      </div>
    </section>
  );
}
