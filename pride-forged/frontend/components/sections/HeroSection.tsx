"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

import { HeroWheel } from "@/components/hero-wheel";
import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";

const stats = [
  ["23\"", "до диаметра"],
  ["8.8 кг", "от массы"],
  ["±0.1", "точность fitment"]
];

const content: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

export function HeroSection() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 700], [0, 30]);
  const glowY = useTransform(scrollY, [0, 700], [0, -70]);

  return (
    <section className="hero-depth relative flex min-h-[calc(100vh-4.25rem)] overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div style={{ y: glowY }} className="absolute left-[-12rem] top-20 h-[34rem] w-[34rem] rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute right-[-22rem] top-[-12rem] h-[54rem] w-[54rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-[-18rem] left-1/2 h-[36rem] w-[70rem] -translate-x-1/2 rounded-[100%] bg-primary/[0.035] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(244,247,251,0.08),transparent_42%,rgba(62,110,168,0.08)_100%)]" />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.18, 0.42, 0.18], scaleX: [0.72, 1, 0.72] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[17%] h-px w-[42rem] origin-left bg-gradient-to-r from-transparent via-primary/35 to-transparent"
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.24, 0.08], x: [0, 36, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[19%] right-[9%] h-px w-[34rem] bg-gradient-to-r from-transparent via-accent/45 to-transparent"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: ["-35%", "35%", "-35%"], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 h-full w-1/3 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(244,247,251,0.09),transparent)] blur-xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 py-14 sm:py-16 md:py-18 lg:grid-cols-[0.98fr_1.02fr] lg:py-10 xl:py-8">
        <motion.div
          style={{ y: textY }}
          variants={content}
          initial="hidden"
          animate="visible"
          className="relative z-10 pt-6 md:pt-0"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-4xl font-black leading-[0.98] text-primary sm:text-6xl lg:text-7xl"
          >
            PRIDE <span className="text-accent">Forged</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-2xl font-semibold leading-tight text-primary sm:text-4xl lg:text-[2.65rem]"
          >
            Характер, выкованный в металле
          </motion.p>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl whitespace-pre-line text-base leading-7 text-graphite sm:text-xl sm:leading-9"
          >
            {"Премиальные кованые диски,\nсозданные под ваш автомобиль."}
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/fitment">Подобрать диски</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/catalog">Каталог</Link></Button>
          </motion.div>
          <motion.div variants={content} className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <motion.div key={value} variants={fadeUp} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>
                <LiquidCard className="h-full rounded-2xl px-3 py-3 sm:px-4">
                  <p className="text-xl font-black text-primary sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-graphite/70 sm:text-xs">{label}</p>
                </LiquidCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <HeroWheel />
      </div>
    </section>
  );
}
