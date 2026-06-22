"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";
import { aboutWorkshopImage } from "@/lib/assets";

const milestones = [
  ["01", "Бриф", "Изучаем автомобиль, тормоза, сценарий езды и желаемую визуальную посадку."],
  ["02", "Инжиниринг", "Проектируем геометрию, нагрузку, вес и параметры под конкретный кузов."],
  ["03", "Финиш", "Подбираем покрытие, контролируем качество и готовим комплект к установке."]
];

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0.35, 0.75], [-34, 34]);

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div style={{ y: shouldReduceMotion ? 0 : imageY }} className="relative order-2 lg:order-1">
          <LiquidCard className="relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
            <div className="relative aspect-[1.35] overflow-hidden rounded-[1.5rem]">
              <Image
                src={aboutWorkshopImage}
                alt="Производство PRIDE Forged"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-accent/10" />
              <div className="absolute inset-0 ring-1 ring-inset ring-primary/10" />
            </div>
          </LiquidCard>
        </motion.div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">О бренде</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-none tracking-[-0.05em] text-primary sm:text-6xl lg:text-7xl">
              Ателье точной посадки
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-graphite sm:text-xl sm:leading-9">
              PRIDE Forged создаёт кованые диски как персональный аксессуар автомобиля: с инженерной точностью, скульптурной геометрией и вниманием к каждой детали комплекта.
            </p>
          </Reveal>
          <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {milestones.map(([number, title, text], index) => (
              <Reveal key={number} className="h-full" delay={index * 0.08}>
                <LiquidCard interactive className="flex h-full flex-col p-5">
                  <span className="text-sm font-black uppercase tracking-[0.22em] text-accent">{number}</span>
                  <h3 className="mt-4 text-xl font-black text-primary">{title}</h3>
                  <p className="mt-3 grow leading-7 text-graphite/70">{text}</p>
                </LiquidCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
