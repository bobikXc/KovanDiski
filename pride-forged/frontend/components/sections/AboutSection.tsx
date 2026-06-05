"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

const milestones = [
  ["01", "Бриф", "Изучаем автомобиль, тормоза, сценарий езды и желаемую визуальную посадку."],
  ["02", "Инжиниринг", "Проектируем геометрию, нагрузку, вес и параметры под конкретный кузов."],
  ["03", "Финиш", "Подбираем покрытие, контролируем качество и готовим комплект к установке."]
];

export function AboutSection() {
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0.35, 0.75], [-34, 34]);

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute left-1/2 top-24 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div style={{ y: imageY }} className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-white/70 blur-2xl" />
          <LiquidCard className="relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
            <Image
              src="/images/pride-studio.svg"
              alt="Ателье PRIDE Forged для премиальных автомобилей"
              width={1200}
              height={800}
              className="h-auto w-full rounded-[1.5rem] object-cover"
            />
          </LiquidCard>
        </motion.div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">О бренде</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.08em] text-primary sm:text-7xl lg:text-8xl">
              Ателье точной посадки
            </h2>
            <p className="mt-7 text-xl leading-9 text-graphite/70">
              PRIDE Forged создаёт кованые диски как персональный аксессуар автомобиля: с инженерной точностью, скульптурной геометрией и вниманием к каждой детали комплекта.
            </p>
          </Reveal>
          <div className="mt-9 space-y-4">
            {milestones.map(([number, title, text], index) => (
              <Reveal key={number} delay={index * 0.08}>
                <LiquidCard interactive className="p-5">
                  <div className="flex gap-4">
                    <span className="text-xl font-black text-accent">{number}</span>
                    <div>
                      <h3 className="text-lg font-bold text-primary">{title}</h3>
                      <p className="mt-2 leading-7 text-graphite/60">{text}</p>
                    </div>
                  </div>
                </LiquidCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
