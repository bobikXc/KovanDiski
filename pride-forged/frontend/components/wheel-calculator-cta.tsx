"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

function WheelSketch() {
  return (
    <svg className="h-48 w-full max-w-sm sm:h-56" viewBox="0 0 360 260" role="img" aria-label="Схема параметров диска">
      <defs>
        <linearGradient id="wheel-cta-rim" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2A3442" />
          <stop offset="52%" stopColor="#132238" />
          <stop offset="100%" stopColor="#3E6EA8" />
        </linearGradient>
      </defs>
      <circle cx="180" cy="130" r="86" fill="url(#wheel-cta-rim)" stroke="#F4F7FB" strokeOpacity="0.16" strokeWidth="2" />
      <circle cx="180" cy="130" r="56" fill="#07111F" stroke="#3E6EA8" strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="180" cy="130" r="18" fill="#F4F7FB" fillOpacity="0.12" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <rect
          key={angle}
          x="175"
          y="64"
          width="10"
          height="52"
          rx="5"
          fill="#A9B7C9"
          fillOpacity="0.16"
          transform={`rotate(${angle} 180 130)`}
        />
      ))}
      <path d="M66 72h70m-70 0 18-18m-18 18 18 18" stroke="#3E6EA8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      <path d="M294 188h-70m70 0-18-18m18 18-18 18" stroke="#F4F7FB" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.75" strokeWidth="3" />
      <line x1="180" x2="180" y1="28" y2="232" stroke="#F4F7FB" strokeDasharray="6 8" strokeOpacity="0.18" strokeWidth="2" />
    </svg>
  );
}

export function WheelCalculatorCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-7xl">
        <LiquidCard className="relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-accent">PRIDE Tools</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-[-0.04em] text-primary sm:text-5xl">
                Калькулятор параметров дисков
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-graphite">
                Сравните штатные и новые параметры, чтобы понять, как изменится посадка колеса.
              </p>
              <Button asChild size="lg" className="group mt-8 w-full gap-3 shadow-[0_18px_48px_rgba(13,27,42,0.18)] hover:scale-[1.02] sm:w-auto">
                <Link href="/tools/wheel-calculator">
                  Рассчитать параметры
                  <span className="transition duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Button>
            </div>
            <motion.div
              aria-hidden="true"
              className="hidden justify-end sm:flex"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <WheelSketch />
            </motion.div>
          </div>
        </LiquidCard>
      </Reveal>
    </section>
  );
}
