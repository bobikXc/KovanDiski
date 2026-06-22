"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";

const actions = [
  {
    title: "Из наличия",
    label: "Смотреть модели",
    href: "/catalog",
    accent: false
  },
  {
    title: "Под заказ",
    label: "Оставить заявку",
    href: "/contact",
    accent: true
  }
];

const steps = [
  {
    number: "01",
    title: "Первичная консультация",
    text: "Вы рассказываете о машине, стиле и желаемой посадке. Мы уточняем параметры и предлагаем подходящие решения."
  },
  {
    number: "02",
    title: "Подбор параметров",
    text: "Проверяем диаметр, ширину, вылет, PCD, DIA и совместимость с тормозной системой."
  },
  {
    number: "03",
    title: "Визуализация",
    text: "Показываем, как выбранная модель дисков будет смотреться на вашем автомобиле."
  },
  {
    number: "04",
    title: "Согласование заказа",
    text: "Фиксируем модель, цвет, размеры, сроки и итоговую комплектацию."
  },
  {
    number: "05",
    title: "Производство или поставка",
    text: "Если модель из наличия — готовим комплект к выдаче. Если под заказ — запускаем изготовление."
  },
  {
    number: "06",
    title: "Контроль и передача",
    text: "Проверяем качество, упаковку и передаём клиенту готовый комплект с рекомендациями по установке."
  }
];

export function DealProcessSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollBack(track.scrollLeft > 4);
    setCanScrollForward(track.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollSteps = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-deal-step]");
    if (!track || !card) return;

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className="deal-process-section relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute right-[-18rem] top-8 h-[36rem] w-[36rem] rounded-full bg-accent/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18rem] left-[-10rem] h-[34rem] w-[34rem] rounded-full bg-primary/8 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(23.75rem,30rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(33.5rem,37.5rem)] xl:gap-12 2xl:gap-14">
          <div className="max-w-[42.5rem]">
            <Reveal>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent opacity-95 sm:text-[13px] sm:tracking-[0.22em]">ПРОЦЕСС СДЕЛКИ</p>
              <h2 className="mt-[18px] max-w-[42.5rem] text-[clamp(1.875rem,8vw,2.375rem)] font-black leading-[1.08] tracking-[-0.035em] text-primary lg:text-[clamp(2.375rem,3.4vw,3.375rem)] lg:leading-[1.04]">
                Всё, что вам нужно — оставить заявку. Остальное мы возьмём на себя
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="deal-process-copy mt-4 max-w-[38.75rem] text-[15px] leading-[1.5] sm:text-base">
                Подберём параметры под ваш автомобиль, покажем визуализацию, согласуем комплектацию и доведём заказ до готового результата.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:mt-[clamp(2.75rem,4vw,4rem)] lg:gap-5">
            {actions.map((action, index) => (
              <Reveal key={action.title} className="h-full" delay={0.08 + index * 0.08} amount={0.16}>
                <Link href={action.href} className="group block h-full">
                  <LiquidCard
                    interactive
                    className={[
                      "deal-action-card relative h-full min-h-[118px] overflow-hidden rounded-[22px] p-5 transition duration-500 ease-out hover:-translate-y-1 hover:border-accent/45 sm:min-h-[138px] sm:rounded-[24px] sm:p-6 lg:min-h-[156px] lg:rounded-[28px] lg:p-7",
                      action.accent
                        ? "deal-action-accent shadow-[0_24px_70px_rgb(var(--accent-rgb)/0.18)]"
                        : "deal-action-neutral"
                    ].join(" ")}
                  >
                    <div className="absolute right-[-4rem] top-[-4rem] h-36 w-36 rounded-full bg-accent/20 blur-3xl transition duration-500 group-hover:bg-accent/28" />
                    <div className="relative z-10 flex h-full flex-col justify-end">
                      <p className="text-xl font-extrabold leading-[1.15] tracking-[-0.02em] text-primary sm:text-[1.35rem] lg:text-2xl">{action.title}</p>
                      <p className="deal-process-copy mt-2.5 text-sm font-semibold leading-[1.2] underline decoration-accent/70 underline-offset-8 transition group-hover:text-accent lg:text-[15px]">
                        {action.label}
                      </p>
                    </div>
                  </LiquidCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-8 lg:mt-10">
          <div className="mb-[22px] flex items-center justify-between gap-4 sm:mb-6">
            <p className="deal-process-copy text-xs font-extrabold uppercase tracking-[0.18em] sm:text-[13px] sm:tracking-[0.22em]">Этапы работы</p>
            <div className="flex items-center gap-2" aria-label="Управление этапами сделки">
              <button
                type="button"
                aria-label="Предыдущий этап"
                disabled={!canScrollBack}
                onClick={() => scrollSteps(-1)}
                className="deal-slider-arrow"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                aria-label="Следующий этап"
                disabled={!canScrollForward}
                onClick={() => scrollSteps(1)}
                className="deal-slider-arrow"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="deal-steps-track no-scrollbar grid grid-flow-col gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2"
            aria-label="Этапы процесса сделки"
          >
            {steps.map((step, index) => (
              <Reveal
                key={step.number}
                className="h-full snap-start"
                delay={Math.min(index * 0.06, 0.18)}
                amount={0.08}
              >
                <LiquidCard
                  interactive
                  className="deal-step-card group relative flex h-full min-h-[264px] flex-col justify-start overflow-hidden rounded-[26px] p-6 transition duration-500 ease-out hover:border-accent/40 hover:shadow-[0_24px_68px_rgb(var(--accent-rgb)/0.14)] sm:min-h-[284px] sm:p-7"
                >
                  <div data-deal-step className="absolute inset-0" aria-hidden="true" />
                  <p className="pointer-events-none absolute right-6 top-[22px] z-0 text-[5.75rem] font-black leading-none tracking-[-0.08em] text-primary/[0.07] transition duration-500 group-hover:text-accent/[0.1] sm:text-[7rem]">
                    {step.number}
                  </p>
                  <div className="relative z-10 flex h-full flex-col items-start pt-12 sm:pt-[52px]">
                    <h3 className="mb-3.5 min-h-[2.72rem] text-xl font-extrabold leading-[1.18] tracking-[-0.02em] text-primary sm:text-[1.35rem]">{step.title}</h3>
                    <p className="deal-process-copy text-[15px] leading-[1.55]">{step.text}</p>
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

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
