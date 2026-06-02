import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getWheel } from "@/lib/api";

export default async function WheelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wheel = await getWheel(slug);
  if (!wheel) notFound();

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
        <div className="mesh-card flex min-h-[460px] items-center justify-center rounded-[2rem] border border-white/10">
          <div className="h-72 w-72 rounded-full border-[42px] border-accent/70" />
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
    </section>
  );
}
