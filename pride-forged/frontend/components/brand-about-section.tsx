"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function BrandAboutSection() {
  return (
    <section className="brand-about-fullbleed relative isolate min-h-[680px] w-full overflow-hidden">
      <div className="brand-about-overlay absolute inset-0" />

      <div className="brand-about-container relative z-10 mx-auto flex w-full max-w-[1520px] items-center justify-end px-5 py-[72px] sm:px-8 lg:px-12 xl:px-16">
        <div className="brand-about-content w-full max-w-[580px] rounded-[22px] border p-5 sm:rounded-[26px] sm:p-7 lg:p-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="brand-about-kicker-line h-px w-9" />
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-accent sm:text-[13px]">О БРЕНДЕ</p>
            </div>
            <h2 className="mt-5 max-w-[540px] text-[clamp(2rem,9vw,2.5rem)] font-black leading-[1.08] tracking-[-0.03em] text-primary lg:text-[clamp(2.25rem,3.6vw,3.625rem)] lg:leading-[1.05]">
              Эксклюзивные кованые диски <span className="text-accent">PRIDE Forged</span> для вашего автомобиля
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="brand-about-copy mt-6 max-w-[530px] text-[15px] leading-[1.6] sm:text-base lg:text-[17px]">
              В заказе кованых дисков много нюансов: параметры, посадка, дизайн, цвет и совместимость с автомобилем. Мы берём эти задачи на себя — подбираем решение, согласуем визуализацию и доводим комплект до результата, которым хочется пользоваться каждый день.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="brand-about-note mt-5 max-w-[520px] border-l-2 border-accent pl-4 text-sm font-semibold leading-[1.55] sm:text-[15px]">
              PRIDE Forged — это индивидуальный подход, контроль деталей и премиальный внешний вид без случайных решений.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="outline" className="brand-about-button w-full sm:w-auto">
                <Link href="/about">О бренде</Link>
              </Button>
              <Button asChild size="lg" className="brand-about-button w-full sm:w-auto">
                <Link href="/contact">Консультация</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
