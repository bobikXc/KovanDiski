"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { heroWheelImage } from "@/lib/assets";

export function HeroWheel() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 80]);
  const parallaxRotate = useTransform(scrollY, [0, 700], [0, 12]);

  return (
    <motion.div
      style={{ y: parallaxY, rotate: parallaxRotate }}
      className="relative mx-auto mt-4 aspect-square w-full max-w-[430px] sm:max-w-[500px] lg:ml-auto lg:mr-4 lg:mt-8 lg:max-w-[560px] xl:mr-8 xl:max-w-[590px]"
    >
      <div className="absolute inset-[8%] rounded-full bg-accent/28 blur-3xl" />
      <div className="absolute inset-[20%] rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 bg-surface/20 shadow-[inset_0_0_90px_rgb(var(--text-primary-rgb)/0.10)]" />
      <div className="absolute bottom-[4%] left-1/2 h-12 w-[58%] -translate-x-1/2 rounded-full bg-primary/30 blur-2xl" />
      <motion.div
        initial={{ x: "72vw", opacity: 0, rotate: -210, scale: 0.82 }}
        animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.72, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full items-center justify-center will-change-transform"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ delay: 1.9, duration: 34, ease: "linear", repeat: Infinity }}
          className="relative h-[86%] w-[86%] drop-shadow-[0_38px_58px_rgba(13,27,42,0.24)] will-change-transform"
        >
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ delay: 1.7, duration: 7.5, ease: "linear", repeat: Infinity }}
            className="absolute inset-[-6%] rounded-full bg-[conic-gradient(from_0deg,transparent,rgb(var(--text-primary-rgb)/0.28),transparent_18%,transparent_100%)] blur-sm"
          />
          <Image
            src={heroWheelImage}
            alt="Премиальный кованый диск PRIDE Forged"
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 92vw"
            className="rounded-full object-contain object-center"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
