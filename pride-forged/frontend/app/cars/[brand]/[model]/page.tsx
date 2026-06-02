import Link from "next/link";

import { FeaturedWheels } from "@/components/sections/FeaturedWheels";
import { getWheels } from "@/lib/api";

export default async function ModelPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { brand, model } = await params;
  const wheels = await getWheels();
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href={`/cars/${brand}`} className="text-sm text-accent">← Назад к моделям</Link>
        <h1 className="mt-5 text-5xl font-black">PRIDE для {brand.toUpperCase()} {model.toUpperCase()}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
          Ниже — базовая подборка. Точные параметры согласуем по тормозной системе, подвеске и желаемой посадке.
        </p>
      </div>
      <FeaturedWheels wheels={wheels.slice(0, 6)} />
    </div>
  );
}
