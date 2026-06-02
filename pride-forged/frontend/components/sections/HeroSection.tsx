"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.45em] text-accent">Forged Wheels Atelier</p>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">PRIDE Forged</h1>
          <p className="mt-6 max-w-2xl text-2xl text-white/76 sm:text-3xl">Характер, выкованный в металле</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg"><Link href="/cars">Подобрать диски</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/catalog">Смотреть каталог</Link></Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mesh-card relative min-h-[360px] rounded-[2rem] border border-white/10 p-8 shadow-premium"
        >
          <div className="absolute inset-8 rounded-full border-[34px] border-accent/70 shadow-[inset_0_0_80px_rgba(255,255,255,0.18)]" />
          <div className="absolute inset-24 rounded-full border-[18px] border-white/35" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
          <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-primary/70 p-5 backdrop-blur">
            <p className="text-sm text-white/60">Custom forged engineering</p>
            <p className="text-2xl font-bold">19–23″ • 8.8 кг • индивидуальный fitment</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
