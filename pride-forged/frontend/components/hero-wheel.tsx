"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const heroCarImage = "/images/cars/cars-lineup.jpg";

export function HeroWheel() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 80]);

  return (
    <motion.div
      style={{ y: shouldReduceMotion ? 0 : parallaxY }}
      className="relative mx-auto mt-4 aspect-[1.18/1] w-full max-w-[450px] sm:aspect-[1.34/1] sm:max-w-[560px] lg:ml-auto lg:mr-4 lg:mt-8 lg:max-w-[640px] xl:mr-8 xl:max-w-[700px]"
    >
      <div className="absolute inset-x-[8%] top-[10%] h-[72%] rounded-[42%] bg-accent/28 blur-3xl" />
      <div className="absolute inset-x-[15%] top-[26%] h-[44%] rounded-[46%] bg-primary/10 blur-2xl" />
      <div className="absolute bottom-[8%] left-1/2 h-16 w-[74%] -translate-x-1/2 rounded-full bg-primary/30 blur-2xl" />
      <div className="absolute inset-x-[4%] bottom-[9%] h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <motion.div
        initial={shouldReduceMotion ? false : { x: "42vw", opacity: 0, scale: 0.94 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.72, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full items-center justify-center will-change-transform"
      >
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ delay: 1.4, duration: 8, ease: "easeInOut", repeat: Infinity }}
          className="relative h-[82%] w-full overflow-hidden rounded-[2rem] border border-primary/10 bg-surface/25 shadow-[0_34px_90px_rgba(13,27,42,0.28),inset_0_1px_0_rgb(var(--text-primary-rgb)/0.10)] backdrop-blur-sm will-change-transform sm:rounded-[2.4rem] lg:h-[78%]"
        >
          <Image
            src={heroCarImage}
            alt="Премиальный автомобиль PRIDE Forged"
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 92vw"
            className="scale-[1.04] object-cover object-[57%_52%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--bg-rgb)/0.34),transparent_34%,rgb(var(--bg-rgb)/0.16)),radial-gradient(circle_at_64%_42%,transparent_0%,rgb(var(--accent-rgb)/0.12)_54%,rgb(var(--bg-rgb)/0.24)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/65 to-transparent" />
          <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
