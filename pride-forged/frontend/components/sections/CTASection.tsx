"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

export function CTASection() {
  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0.65, 1], [70, -40]);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-7xl">
        <LiquidCard className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-premium sm:p-12 lg:p-16">
          <motion.div style={{ y: orbY }} className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Консультация</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-black leading-none tracking-[-0.06em] text-primary sm:text-6xl lg:text-7xl">
                Соберём комплект под ваш автомобиль и стиль вождения
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
                Оставьте заявку — специалист PRIDE уточнит параметры, предложит дизайн и рассчитает стоимость производства.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="shadow-[0_18px_40px_rgba(74,111,165,0.28)]">
              <Link href="/contact">Связаться с PRIDE</Link>
            </Button>
          </div>
        </LiquidCard>
      </Reveal>
    </section>
  );
}
