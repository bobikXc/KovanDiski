import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { getWheelAsset } from "@/lib/assets";
import type { Wheel } from "@/lib/api";

export function getWheelImage(wheel: Wheel, index = 0) {
  return getWheelAsset(wheel, index);
}

export function getWheelImageOrFallback(wheel: Wheel, _index = 0) {
  return getWheelAsset(wheel, 0);
}

export function formatWheelPrice(_price: Wheel["price"]) {
  return "по запросу";
}

export function WheelCard({ wheel, index = 0 }: { wheel: Wheel; index?: number }) {
  const imageSrc = getWheelImageOrFallback(wheel);

  return (
    <LiquidCard interactive className="wheel-card group flex h-full flex-col overflow-hidden rounded-[1.75rem] p-3 transition duration-500 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_82px_rgb(var(--accent-rgb)/0.18)] sm:p-4">
      <Link href={`/catalog/${wheel.slug}`} className="block">
        <div className="mesh-card relative mb-5 flex aspect-[1.08] items-center justify-center overflow-hidden rounded-[1.4rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgb(var(--text-primary-rgb)/0.12),transparent_38%)]" />
          <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-primary/25 blur-2xl" />
          <Image
            src={imageSrc}
            alt={`Кованый диск ${wheel.name}`}
            width={1100}
            height={980}
            className="wheel-card-image relative h-[96%] w-[96%] object-contain object-center drop-shadow-[0_28px_48px_rgba(0,0,0,0.38)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-primary">{wheel.name}</h3>
            <p className="mt-2 text-sm text-graphite/70">
              {wheel.diameter}″ • {wheel.weight} кг • ET{wheel.et}
            </p>
          </div>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            forged
          </span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-graphite/65">{wheel.description}</p>
        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-end justify-between gap-4">
            <p className="text-2xl font-black leading-tight text-primary">
              <span className="block text-sm uppercase tracking-[0.14em] text-graphite/70">Цена</span>
              {formatWheelPrice(wheel.price)}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[0.92fr_1.08fr]">
            <Button asChild size="default" variant="outline" className="min-w-0 px-4 text-center">
              <Link href={`/catalog/${wheel.slug}`}>Подробнее</Link>
            </Button>
            <Button asChild size="default" className="min-w-0 px-4 text-center">
              <Link href="/contact">Консультация</Link>
            </Button>
          </div>
        </div>
      </div>
    </LiquidCard>
  );
}
