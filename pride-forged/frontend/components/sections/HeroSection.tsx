"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";

import { HeroSlider } from "@/components/hero-slider";
import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";

const stats = [
  ["A6061-T6", "Все наши диски изготавливаются из авиационного алюминия"],
  ["Индивидуальный подход", "к каждому проекту"],
  ["Гарантия 5 лет", "на структуру диска и ЛКП"]
];

const heroCarImages = [
  "/images/purple-audi-rs6-avant-wheels-brixton-forged-r11-rs-aerotech-wheel-70.jpg",
  "/images/grey-bmw-x5-m-wheels-brixton-forged-fde03-monoblock-31.jpg",
  "/images/brixton-forged-pf13-rs-monoblock-one-piece-wheels-bmw-x5m-competition-4-2.jpg",
  "/images/grey-bmw-g80-m3-touring-cs-brixton-forged-wheels-fr16-1-piece-2.jpg",
  "/images/green-ferrari-296-speciale-wheels-brixton-forged-wheel-pf14-rs-1-piece-wheel-3.jpg"
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
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 700], [0, -70]);

  return (
    <section className="hero-depth relative isolate flex min-h-[calc(100vh-4.25rem)] overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div style={{ y: shouldReduceMotion ? 0 : glowY }} className="absolute left-[-12rem] top-20 h-[34rem] w-[34rem] rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute right-[-22rem] top-[-12rem] h-[54rem] w-[54rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-[-18rem] left-1/2 h-[36rem] w-[70rem] -translate-x-1/2 rounded-[100%] bg-primary/[0.035] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(var(--text-primary-rgb)/0.08),transparent_42%,rgb(var(--accent-rgb)/0.08)_100%)]" />
      <motion.div
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { opacity: [0.08, 0.24, 0.08], x: [0, 36, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[19%] right-[9%] h-px w-[34rem] bg-gradient-to-r from-transparent via-accent/45 to-transparent"
      />
      <motion.div
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { x: ["-35%", "35%", "-35%"], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 h-full w-1/3 rotate-12 bg-[linear-gradient(90deg,transparent,rgb(var(--text-primary-rgb)/0.09),transparent)] blur-xl"
      />

      <HeroSlider images={heroCarImages} />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center py-14 sm:py-16 md:py-18 lg:py-10 xl:py-8">
        <motion.div
          variants={content}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="relative z-10 flex w-full flex-col justify-center pt-6 md:pt-0 lg:w-[46%] lg:max-w-[38.75rem] lg:self-center lg:pr-[clamp(1.25rem,4vw,4.5rem)] xl:w-[48%]"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[37.5rem] text-[clamp(2.375rem,11vw,3.375rem)] font-black leading-[0.95] tracking-[-0.055em] text-primary md:text-[clamp(3rem,6.2vw,4rem)] lg:text-[clamp(3.125rem,5vw,4.875rem)]"
          >
            ИЗГОТОВЛЕНИЕ КОВАНЫХ ДИСКОВ НА ЛЮБОЙ АВТО
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[35rem] text-base font-semibold leading-[1.5] text-graphite sm:text-lg sm:leading-8 lg:text-[1.125rem]"
          >
            Подберем или разработаем уникальный дизайн и идеальные параметры под вашу марку из наличия или под заказ
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/tools/wheel-calculator">Рассчитать стоимость</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/catalog">Каталог</Link></Button>
          </motion.div>
          <motion.div variants={content} className="mt-8 grid max-w-[30rem] grid-cols-1 gap-2 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <motion.div key={value} variants={fadeUp} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>
                <LiquidCard className="h-full rounded-2xl px-3 py-3 sm:py-2.5">
                  <p className="break-words text-base font-black leading-[1.15] text-primary sm:text-[0.8rem] sm:leading-[1.12]">{value}</p>
                  <p className="mt-1.5 text-xs font-medium leading-[1.3] text-graphite sm:text-[0.62rem]">{label}</p>
                </LiquidCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
