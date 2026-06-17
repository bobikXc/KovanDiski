import type { Metadata } from "next";
import Link from "next/link";

import { WheelCard } from "@/components/catalog/WheelCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { safeGetWheels } from "@/lib/server-api";

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
  const wheels = await safeGetWheels();

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute -right-40 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute left-[-18rem] top-64 -z-10 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <LiquidCard className="relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-12">
          <div className="absolute right-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">PRIDE Forged</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-none text-primary sm:text-6xl lg:text-7xl">
                Каталог кованых дисков
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-graphite">
                Премиальная линейка PRIDE с реалистичными изображениями, точными параметрами и консультацией по fitment под конкретный автомобиль.
              </p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/contact">Получить консультацию</Link>
            </Button>
          </div>
        </LiquidCard>

        {wheels.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Каталог временно недоступен" description="Попробуйте обновить страницу или откройте каталог позже." />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wheels.map((wheel, index) => <WheelCard key={wheel.slug} wheel={wheel} index={index} />)}
          </div>
        )}
      </div>
    </section>
  );
}
