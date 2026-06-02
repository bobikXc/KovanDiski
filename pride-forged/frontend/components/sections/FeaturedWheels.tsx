"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import type { Wheel } from "@/lib/api";

const placeholderImages = ["/images/pride-wheel-01.svg", "/images/pride-wheel-02.svg", "/images/pride-wheel-03.svg"];

function getWheelImage(wheel: Wheel, index: number) {
  const imageUrl = wheel.images?.[0]?.image_url;
  return imageUrl?.startsWith("/") ? imageUrl : placeholderImages[index % placeholderImages.length];
}

export function FeaturedWheels({ wheels }: { wheels: Wheel[] }) {
  const featured = wheels.slice(0, 6);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Каталог</p>
            <h2 className="mt-4 text-3xl font-black sm:text-5xl lg:text-6xl">Флагманские модели</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-white underline decoration-accent underline-offset-8 transition hover:text-accent">
            Все модели
          </Link>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((wheel, index) => (
            <motion.div
              key={wheel.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
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
                      <p className="mt-2 text-sm text-white/60">{wheel.diameter}″ • {wheel.width}J • ET{wheel.et}</p>
                    </div>
                    <span className="rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      forged
                    </span>
                  </div>
                  <p className="mt-5 text-lg font-semibold">от {Number(wheel.price).toLocaleString("ru-RU")} ₽</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
