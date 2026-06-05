import type { Metadata } from "next";

import { EmptyState } from "@/components/common/EmptyState";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { BrandCard } from "@/components/vehicles/BrandCard";
import { getBrandsWithModels } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог автомобилей — PRIDE Forged",
  description: "Каталог марок автомобилей для подбора кованых дисков PRIDE Forged по fitment.",
  openGraph: {
    title: "Каталог автомобилей — PRIDE Forged",
    description: "Выберите марку и модель автомобиля, чтобы посмотреть подходящие диски PRIDE Forged.",
    type: "website",
    url: "/vehicles"
  }
};

export default async function VehiclesPage() {
  const brands = await getBrandsWithModels();

  return (
    <>
      <VehicleSelector brands={brands} />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black sm:text-6xl">Каталог автомобилей</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-graphite/70">
            Марки загружаются из FastAPI backend. Внутри каждой марки доступны модели и проверенные связки Fitment.
          </p>
          {brands.length === 0 ? (
            <div className="mt-12">
              <EmptyState title="Марки не найдены" description="Backend вернул пустой каталог автомобилей. Добавьте марки и модели в базу данных." />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {brands.map((brand) => <BrandCard key={brand.slug} brand={brand} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
