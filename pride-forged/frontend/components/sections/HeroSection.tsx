"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const stats = [
  ["23\"", "до диаметра"],
  ["8.8 кг", "от массы"],
  ["±0.1", "точность fitment"]
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(119,141,169,0.32),transparent_32rem),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.12),transparent_24rem)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-primary to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 py-24 md:py-28 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-12 md:pt-0"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.42em] text-accent sm:text-sm">
            Bespoke forged wheels atelier
          </p>
          <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl">
            PRIDE <span className="block text-accent">Forged</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 sm:text-2xl sm:leading-10">
            Премиальные кованые диски под характер автомобиля: точный fitment, выразительная геометрия и отделка уровня show car.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg"><Link href="/cars">Подобрать диски</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/catalog">Смотреть каталог</Link></Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={value} className="glass-card rounded-2xl px-4 py-4">
                <p className="text-2xl font-black text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[620px]"
        >
          <div className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl" />
          <div className="glass-card relative overflow-hidden rounded-[2rem] p-4 shadow-premium sm:p-6">
            <Image
              src="/images/pride-hero-wheel.svg"
              alt="Премиальный кованый диск PRIDE Forged"
              width={1200}
              height={1000}
              priority
              className="h-auto w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)] transition duration-700 hover:scale-105"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-primary/72 p-5 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8">
              <p className="text-xs uppercase tracking-[0.32em] text-accent">Signature series</p>
              <p className="mt-2 text-xl font-bold sm:text-2xl">Monoblock forging • custom finish • exact stance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
