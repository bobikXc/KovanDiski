"use client";

import Image from "next/image";

import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

const decorativeWheelImage = "/images/Фон.png";

const advantages = [
  ["Гарантия 5 лет", "Гарантия на структуру диска и ЛКП фиксируется в договоре. В спорных случаях берём решение на себя: ремонт или замена за наш счёт."],
  ["Динамика автомобиля", "Кованые диски легче штатных литых на 20–30%. Меньше неподрессоренная масса — выше отклик, ниже нагрузка на приводы и лучше разгон."],
  ["Защита от микротрещин", "Используем авиационный алюминий A6061-T6 и ковку под высоким давлением. Плотная структура снижает риск микротрещин и повышает ресурс."],
  ["Экстремальные нагрузки", "Индекс нагрузки кованых дисков выше, чем у большинства литых аналогов. Это даёт запас прочности для активной езды и тяжёлых условий."],
  ["Защита от коррозии", "Порошковое покрытие с термообработкой защищает от реагентов, соли и перепадов температур от −30°C до +50°C."],
  ["Строгие допуски", "Биение наших дисков не превышает 0,3 мм. Это более чем в два раза строже допуска 0,7 мм, применяемого в премиальном сегменте."]
];

export function AdvantagesSection() {
  return (
    <section className="advantages-section relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-16 xl:py-20">
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
          <h2 className="mt-3 max-w-[920px] text-[clamp(2.125rem,9vw,2.875rem)] font-black leading-[1.02] tracking-[-0.045em] text-primary sm:text-[clamp(2.75rem,5vw,4.5rem)]">
            Выбирая кованые диски, вы получаете безопасность, скорость и стиль вашего авто
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
        <Reveal className="mx-auto mt-7 max-w-[1100px] sm:mt-9" delay={0.14} amount={0.12}>
          <LiquidCard className="relative z-[2] rounded-[28px] border border-accent/25 px-5 py-6 text-left shadow-[0_24px_68px_rgb(var(--accent-rgb)/0.12)] sm:rounded-[32px] sm:px-8 sm:py-8 lg:px-10 lg:py-9 lg:text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent">Индивидуальный проект</p>
            <h3 className="mt-3 text-[clamp(1.55rem,7vw,2.35rem)] font-black uppercase leading-[1.02] tracking-[-0.035em] text-primary">
              Изготавливаем диски на любой автомобиль
            </h3>
            <p className="mx-auto mt-4 max-w-[860px] text-sm font-medium leading-[1.58] text-graphite sm:text-base sm:leading-[1.65]">
              Вам нравятся диски другой марки? Не вопрос. Производим диски под точные параметры: ширина, вылет, разболтовка и центральное отверстие. Подберём решение для 1000+ моделей авто, включая редкие проекты — Aston Martin, Lotus, McLaren и другие.
            </p>
          </LiquidCard>
        </Reveal>
      </div>
    </section>
  );
}
