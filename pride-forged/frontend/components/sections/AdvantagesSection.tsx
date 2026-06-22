"use client";

import Image from "next/image";

import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

const decorativeWheelImage = "/images/Фон.png";

const advantages = [
  ["Собственное производство", "Контроль геометрии, сроков и качества на каждом этапе: от 3D-модели до финального покрытия."],
  ["Инженерный fitment", "Параметры под конкретный кузов, тормозную систему, клиренс и желаемую посадку автомобиля."],
  ["Премиальная отделка", "Сатин, gloss, brushed, diamond cut и индивидуальные оттенки в темной polished-metal эстетике PRIDE."],
  ["Легкая ковка", "Моноблочная конструкция снижает неподрессоренную массу без компромисса по прочности."],
  ["Персональный сервис", "Сопровождение клиента от первой консультации до установки и рекомендаций по уходу."],
  ["Гарантия результата", "Прозрачные сроки, контроль качества и документация на каждый изготовленный комплект."]
];

export function AdvantagesSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-16 xl:py-20">
      <div aria-hidden="true" className="advantages-wheel-shell pointer-events-none absolute bottom-[-10%] right-[-46%] z-0 h-[28rem] w-[28rem] sm:bottom-[-16%] sm:right-[-28%] sm:h-[42rem] sm:w-[42rem] lg:bottom-auto lg:right-[-22%] lg:top-[8%] lg:h-[52rem] lg:w-[52rem] xl:h-[60rem] xl:w-[60rem] 2xl:h-[65rem] 2xl:w-[65rem]">
        <div className="absolute inset-[8%] rounded-full bg-accent/25 blur-3xl" />
        <div className="pride-slow-spin absolute inset-0 overflow-hidden rounded-full shadow-[0_0_90px_rgb(var(--accent-rgb)/0.18)]">
          <Image
            src={decorativeWheelImage}
            alt=""
            fill
            sizes="(min-width: 1536px) 65rem, (min-width: 1280px) 60rem, (min-width: 1024px) 52rem, (min-width: 640px) 42rem, 28rem"
            className="scale-[1.02] object-cover object-center"
          />
        </div>
      </div>
      <div aria-hidden="true" className="advantages-wheel-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div className="relative z-[2] mx-auto max-w-[1440px]">
        <Reveal className="mb-8 max-w-5xl lg:mb-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent sm:text-sm sm:tracking-[0.24em]">Почему PRIDE</p>
          <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-normal text-primary sm:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem]">
            Диски, которые работают на образ и динамику
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
          {advantages.map(([title, text], index) => (
            <Reveal key={title} className="h-full" delay={index * 0.08} amount={0.12}>
              <LiquidCard interactive className="advantages-card group h-full rounded-[22px] p-5 sm:p-6 lg:min-h-[210px] lg:rounded-[24px] lg:p-7">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-surface/65 text-xs font-black text-accent shadow-liquid">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold leading-[1.2] tracking-normal text-primary lg:text-xl">{title}</h3>
                <p className="advantages-card-description mt-2 text-sm leading-[1.45] lg:text-[0.9375rem]">{text}</p>
              </LiquidCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
