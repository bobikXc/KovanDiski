"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import { getWheelImage } from "@/components/catalog/WheelCard";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";
import type { Wheel } from "@/lib/api";

const carousel: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const card: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

export function FeaturedWheels({ wheels }: { wheels: Wheel[] }) {
  const featured = wheels.slice(0, 6);

  return (
    <section className="overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Каталог</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.06em] text-primary sm:text-6xl lg:text-7xl">
              Флагманские модели
            </h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-primary underline decoration-accent underline-offset-8 transition hover:text-accent">
            Все модели
          </Link>
        </Reveal>
        <motion.div
          variants={carousel}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4"
        >
          {featured.map((wheel, index) => (
            <motion.div key={wheel.slug} variants={card} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }} className="min-w-[82vw] snap-center sm:min-w-[440px] lg:min-w-[520px]">
              <Link href={`/catalog/${wheel.slug}`} className="block h-full">
                <LiquidCard interactive className="group h-full overflow-hidden p-4 sm:p-6">
                  <div className="mesh-card relative flex aspect-[1.18] items-center justify-center overflow-hidden rounded-[1.7rem]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.95),transparent_38%)]" />
                    <Image
                      src={getWheelImage(wheel, index)}
                      alt={`Кованый диск ${wheel.name}`}
                      width={1100}
                      height={950}
                      className="relative h-[86%] w-[86%] object-contain drop-shadow-[0_30px_55px_rgba(13,27,42,0.22)] transition duration-700 group-hover:scale-110 group-hover:rotate-12"
                    />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-3xl font-black tracking-tight text-primary">{wheel.name}</h3>
                      <p className="mt-3 text-sm text-graphite/60">
                        {wheel.diameter}″ • {wheel.width}J • ET{wheel.et} • {wheel.pcd} • DIA {wheel.dia}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      forged
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/40 p-3"><span className="block text-graphite/50">Вес</span><b>{wheel.weight} кг</b></div>
                    <div className="rounded-2xl bg-white/40 p-3"><span className="block text-graphite/50">PCD</span><b>{wheel.pcd}</b></div>
                    <div className="rounded-2xl bg-white/40 p-3"><span className="block text-graphite/50">Цена</span><b>{Number(wheel.price).toLocaleString("ru-RU")} ₽</b></div>
                  </div>
                </LiquidCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
