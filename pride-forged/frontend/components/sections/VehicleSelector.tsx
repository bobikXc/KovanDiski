"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { carsLineupImage } from "@/lib/assets";
import type { Brand } from "@/lib/api";

export function VehicleSelector({ brands }: { brands: Brand[] }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: { opacity: 0, y: 34 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 } }
        }}
      >
        <LiquidCard className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-0">
          <div className="relative min-h-[440px] overflow-hidden p-6 sm:p-10 lg:p-12">
            <Image
              src={carsLineupImage}
              alt="Автомобили для подбора дисков PRIDE"
              fill
              sizes="1180px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/78 to-background/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/24 blur-3xl" />
            <div className="relative flex min-h-[22rem] max-w-xl flex-col justify-end">
              <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Selection hub</p>
                <h2 className="mt-4 text-3xl font-black sm:text-5xl">Подбор дисков</h2>
                <p className="mt-5 leading-8 text-graphite">
                  Два сценария в одном разделе: подбор по автомобилю или проверка совместимости конкретной модели диска.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/fitment" className="rounded-2xl border border-primary/10 bg-surface/70 p-4 text-sm font-semibold text-primary backdrop-blur-xl transition hover:-translate-y-1 hover:border-accent/45">
                    По автомобилю
                  </Link>
                  <Link href="/fitment" className="rounded-2xl border border-primary/10 bg-surface/70 p-4 text-sm font-semibold text-primary backdrop-blur-xl transition hover:-translate-y-1 hover:border-accent/45">
                    По модели диска
                  </Link>
                </div>
                <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
                  <Link href="/fitment">Перейти к подбору</Link>
                </Button>
              </motion.div>
              <div className="mt-8 inline-flex w-fit rounded-full border border-primary/10 bg-surface/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-graphite backdrop-blur-xl">
                {brands.length} марок в базе fitment
              </div>
            </div>
          </div>
        </LiquidCard>
      </motion.div>
    </section>
  );
}
