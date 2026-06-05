"use client";

import { motion, type Variants } from "framer-motion";

import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

const advantages = [
  ["Собственное производство", "Контроль геометрии, сроков и качества на каждом этапе: от 3D-модели до финального покрытия."],
  ["Инженерный fitment", "Параметры под конкретный кузов, тормозную систему, клиренс и желаемую посадку автомобиля."],
  ["Премиальная отделка", "Сатин, gloss, brushed, diamond cut и индивидуальные оттенки в новой светлой эстетике PRIDE."],
  ["Легкая ковка", "Моноблочная конструкция снижает неподрессоренную массу без компромисса по прочности."],
  ["Персональный сервис", "Сопровождение клиента от первой консультации до установки и рекомендаций по уходу."],
  ["Гарантия результата", "Прозрачные сроки, контроль качества и документация на каждый изготовленный комплект."]
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export function AdvantagesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Почему PRIDE</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.06em] text-primary sm:text-6xl lg:text-7xl">
            Диски, которые работают на образ и динамику
          </h2>
        </Reveal>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {advantages.map(([title, text], index) => (
            <motion.div key={title} variants={item} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <LiquidCard interactive className="group h-full p-7">
                <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/50 text-sm font-black text-accent shadow-liquid">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-primary">{title}</h3>
                <p className="mt-4 leading-7 text-graphite/70">{text}</p>
              </LiquidCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
