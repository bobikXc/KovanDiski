import type { Metadata } from "next";

import { WheelCard } from "@/components/catalog/WheelCard";
import { EmptyState } from "@/components/common/EmptyState";
import { getWheels } from "@/lib/api";

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
  const wheels = await getWheels();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">PRIDE Forged</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">Каталог кованых дисков</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
          Полная линейка премиальных моделей с изображениями, характеристиками и переходом в детальную карточку.
        </p>

        {wheels.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Каталог пока пуст" description="FastAPI backend вернул пустой список дисков. Добавьте модели в базу данных или выполните seed." />
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wheels.map((wheel, index) => <WheelCard key={wheel.slug} wheel={wheel} index={index} />)}
          </div>
        )}
      </div>
    </section>
  );
}
