import { FeaturedWheels } from "@/components/sections/FeaturedWheels";
import { getWheels } from "@/lib/api";

export const metadata = { title: "Каталог дисков — PRIDE Forged" };

export default async function CatalogPage() {
  const wheels = await getWheels();
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">PRIDE Forged</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">Каталог кованых дисков</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
          12 премиальных моделей с индивидуальными параметрами, отделкой и посадкой под ваш автомобиль.
        </p>
      </div>
      <FeaturedWheels wheels={wheels} />
    </div>
  );
}
