"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const milestones = [
  ["01", "Бриф", "Изучаем автомобиль, тормоза, сценарий езды и желаемую визуальную посадку."],
  ["02", "Инжиниринг", "Проектируем геометрию, нагрузку, вес и параметры под конкретный кузов."],
  ["03", "Финиш", "Подбираем покрытие, контролируем качество и готовим комплект к установке."]
];

export function AboutSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2.5rem] bg-accent/10 blur-2xl" />
          <div className="glass-card relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
            <Image
              src="/images/pride-studio.svg"
              alt="Ателье PRIDE Forged для премиальных автомобилей"
              width={1200}
              height={800}
              className="h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">О бренде</p>
          <h2 className="mt-4 text-3xl font-black sm:text-5xl lg:text-6xl">PRIDE Forged — ателье точной посадки</h2>
          <p className="mt-6 text-lg leading-9 text-white/70">
            Мы создаём кованые диски как персональный аксессуар автомобиля: с инженерной точностью, выразительным дизайном и вниманием к каждой детали комплекта.
          </p>
          <div className="mt-8 space-y-4">
            {milestones.map(([number, title, text]) => (
              <div key={number} className="glass-card rounded-3xl p-5 transition hover:-translate-y-1 hover:border-accent/60">
                <div className="flex gap-4">
                  <span className="text-xl font-black text-accent">{number}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="mt-2 leading-7 text-white/62">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
