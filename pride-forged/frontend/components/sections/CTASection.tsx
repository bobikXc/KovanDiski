"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white p-8 text-primary shadow-premium sm:p-12 lg:p-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Консультация</p>
              <h2 className="mt-4 max-w-4xl text-3xl font-black sm:text-5xl lg:text-6xl">Соберём комплект под ваш автомобиль и стиль вождения</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-primary/70">
                Оставьте заявку — специалист PRIDE уточнит параметры, предложит дизайн и рассчитает стоимость производства.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="shadow-[0_18px_40px_rgba(119,141,169,0.35)]">
              <Link href="/contact">Связаться с PRIDE</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
