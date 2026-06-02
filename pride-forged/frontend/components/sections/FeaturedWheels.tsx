import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Wheel } from "@/lib/api";

export function FeaturedWheels({ wheels }: { wheels: Wheel[] }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Каталог</p>
            <h2 className="mt-4 text-3xl font-black sm:text-5xl">Флагманские модели</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-white underline decoration-accent underline-offset-8">
            Все модели
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wheels.slice(0, 6).map((wheel) => (
            <Link key={wheel.slug} href={`/catalog/${wheel.slug}`}>
              <Card className="group overflow-hidden p-6 transition hover:-translate-y-1 hover:border-accent/60">
                <div className="mesh-card mb-6 flex aspect-square items-center justify-center rounded-3xl">
                  <div className="h-40 w-40 rounded-full border-[22px] border-accent/70 transition group-hover:rotate-45" />
                </div>
                <h3 className="text-2xl font-bold">{wheel.name}</h3>
                <p className="mt-2 text-sm text-white/60">{wheel.diameter}″ • {wheel.width}J • ET{wheel.et}</p>
                <p className="mt-4 text-lg font-semibold">от {Number(wheel.price).toLocaleString("ru-RU")} ₽</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
