import Link from "next/link";

import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { Card } from "@/components/ui/card";
import { getBrands } from "@/lib/api";

export const metadata = { title: "Подбор по автомобилю — PRIDE Forged" };

export default async function CarsPage() {
  const brands = await getBrands();
  return (
    <>
      <VehicleSelector brands={brands} />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link key={brand.slug} href={`/cars/${brand.slug}`}>
              <Card className="p-7 text-center transition hover:-translate-y-1 hover:border-accent/60">
                <p className="text-2xl font-black">{brand.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
