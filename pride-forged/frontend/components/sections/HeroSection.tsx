"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

import { HeroWheel } from "@/components/hero-wheel";
import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";

const stats = [
  ["23\"", "до диаметра"],
  ["8.8 кг", "от массы"],
  ["±0.1", "точность fitment"]
];

export function HeroSection() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 700], [0, 54]);
  const glowY = useTransform(scrollY, [0, 700], [0, -70]);

  return (
    <section className="relative flex min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div style={{ y: glowY }} className="absolute left-[-12rem] top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute right-[-20rem] top-[-12rem] -z-10 h-[54rem] w-[54rem] rounded-full bg-white/90 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 py-24 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:py-0">
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pt-12 md:pt-0"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.42em] text-accent sm:text-sm">
            Bespoke forged wheels atelier
          </p>
          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.88] tracking-[-0.08em] text-primary sm:text-8xl lg:text-9xl">
            PRIDE <span className="block text-accent">Forged</span>
          </h1>
          <p className="mt-7 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl">
            Характер, выкованный в металле
          </p>
          <p className="mt-6 max-w-xl whitespace-pre-line text-lg leading-8 text-graphite/70 sm:text-2xl sm:leading-10">
            {"Премиальные кованые диски,\nсозданные под ваш автомобиль."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg"><Link href="/cars">Подобрать диски</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/catalog">Смотреть каталог</Link></Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <LiquidCard key={value} className="rounded-2xl px-4 py-4">
                <p className="text-2xl font-black text-primary sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-graphite/50">{label}</p>
              </LiquidCard>
            ))}
          </div>
        </motion.div>

        <HeroWheel />
      </div>
    </section>
  );
}
