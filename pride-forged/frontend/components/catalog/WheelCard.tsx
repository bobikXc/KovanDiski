import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Wheel } from "@/lib/api";

const placeholderImages = ["/images/pride-wheel-01.svg", "/images/pride-wheel-02.svg", "/images/pride-wheel-03.svg"];

export function getWheelImage(wheel: Wheel, index = 0) {
  const imageUrl = wheel.images?.[0]?.image_url;
  return imageUrl?.startsWith("/") ? imageUrl : placeholderImages[index % placeholderImages.length];
}

export function WheelCard({ wheel, index = 0 }: { wheel: Wheel; index?: number }) {
  return (
    <Link href={`/catalog/${wheel.slug}`} className="block h-full">
      <Card className="group h-full overflow-hidden p-4 transition duration-300 hover:-translate-y-2 hover:border-accent/70 hover:bg-white/10 sm:p-6">
        <div className="mesh-card relative mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.16),transparent_42%)]" />
          <Image
            src={getWheelImage(wheel, index)}
            alt={`Кованый диск ${wheel.name}`}
            width={900}
            height={900}
            className="relative h-[82%] w-[82%] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.42)] transition duration-700 group-hover:scale-110 group-hover:rotate-12"
          />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">{wheel.name}</h3>
            <p className="mt-2 text-sm text-white/60">
              {wheel.diameter}″ • {wheel.width}J • ET{wheel.et} • {wheel.pcd}
            </p>
          </div>
          <span className="rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            forged
          </span>
        </div>
        <p className="mt-5 text-lg font-semibold">от {Number(wheel.price).toLocaleString("ru-RU")} ₽</p>
      </Card>
    </Link>
  );
}
