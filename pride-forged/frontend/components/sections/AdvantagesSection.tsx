"use client";

import { motion, type Variants } from "framer-motion";

import { Card } from "@/components/ui/card";

const advantages = [
  ["Собственное производство", "Контроль геометрии, сроков и качества на каждом этапе: от 3D-модели до финального покрытия."],
  ["Инженерный fitment", "Параметры под конкретный кузов, тормозную систему, клиренс и желаемую посадку автомобиля."],
  ["Премиальная отделка", "Сатин, gloss, brushed, diamond cut и индивидуальные оттенки в темной эстетике PRIDE."],
  ["Легкая ковка", "Моноблочная конструкция снижает неподрессоренную массу без компромисса по прочности."],
  ["Персональный сервис", "Сопровождение клиента от первой консультации до установки и рекомендаций по уходу."],
  ["Гарантия результата", "Прозрачные сроки, контроль качества и документация на каждый изготовленный комплект."]
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export function AdvantagesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Почему PRIDE</p>
          <h2 className="mt-4 text-3xl font-black sm:text-5xl lg:text-6xl">Диски, которые работают на образ и динамику</h2>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {advantages.map(([title, text], index) => (
            <motion.div key={title} variants={item} transition={{ duration: 0.55, ease: "easeOut" }}>
              <Card className="group h-full p-7 transition duration-300 hover:-translate-y-2 hover:border-accent/70 hover:bg-white/10">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-sm font-black text-accent">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-4 leading-7 text-white/64">{text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
