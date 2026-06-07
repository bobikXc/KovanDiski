import Image from "next/image";

import { CTASection } from "@/components/sections/CTASection";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";
import { aboutWorkshopImage } from "@/lib/assets";

export const metadata = { title: "О компании — PRIDE Forged" };

const paragraphs = [
  "PRIDE — это не просто магазин. Это пространство, где ценят стиль, понимают технику и говорят на одном языке с автолюбителями.",
  "Наша компания специализируется на производстве и продаже кованых дисков. Мы создаём диски, которые подчеркивают индивидуальность автомобиля и обеспечивают максимальную надёжность на дороге.",
  "Обратившись в PRIDE, вы можете быть уверены в том, что покупаете не просто комплект дисков. Мы сопровождаем клиента от первого вопроса до момента установки.",
  "Все процессы выстроены внутри компании, что позволяет нам предлагать честные сроки, выгодные цены и гарантии.",
  "Мы уверены: кованые диски должны не только быть прочными и лёгкими, но и идеально вписываться в образ автомобиля."
];

const pillars = [
  ["01", "Точная посадка", "Проверяем геометрию под кузов, тормозную систему и желаемую визуальную позицию."],
  ["02", "Кованая основа", "Работаем с прочной заготовкой, контролируем вес, ресурс и поведение диска под нагрузкой."],
  ["03", "Персональный финиш", "Подбираем цвет, фактуру и детали комплекта так, чтобы диск выглядел частью автомобиля."]
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-48 top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">О бренде</p>
              <h1 className="mt-4 max-w-xl text-5xl font-black leading-none tracking-[-0.05em] text-primary sm:text-6xl lg:text-7xl">
                PRIDE Forged
              </h1>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="space-y-5 text-lg leading-9 text-graphite">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="mt-12">
            <LiquidCard className="relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
              <div className="relative aspect-[16/7] min-h-[260px] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={aboutWorkshopImage}
                  alt="Мастерская и производство PRIDE Forged"
                  fill
                  priority
                  sizes="(min-width: 1024px) 1180px, 92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-primary/10" />
                <div className="absolute bottom-6 left-6 max-w-md sm:bottom-8 sm:left-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Forged atelier</p>
                  <p className="mt-3 text-2xl font-black text-primary sm:text-4xl">Точность производства видна в каждой грани</p>
                </div>
              </div>
            </LiquidCard>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {pillars.map(([number, title, text], index) => (
              <Reveal key={number} className="h-full" delay={index * 0.08}>
                <LiquidCard interactive className="flex h-full flex-col p-6 sm:p-7">
                  <span className="text-sm font-black uppercase tracking-[0.22em] text-accent">{number}</span>
                  <h2 className="mt-5 text-2xl font-black text-primary">{title}</h2>
                  <p className="mt-4 grow leading-7 text-graphite/70">{text}</p>
                </LiquidCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
