"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const productionImage = "/images/production/production-wheel-black.jpg";

export function ProductionSection() {
  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="production-panel relative isolate overflow-hidden rounded-[28px] border border-[var(--border)] sm:rounded-[36px] lg:grid lg:min-h-[560px] lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:rounded-[40px]">
          <div className="production-copy-area relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[560px] lg:px-14 lg:py-16 xl:px-16">
            <Reveal>
              <p className="font-kicker text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent opacity-90 sm:text-xs lg:tracking-[0.22em]">
                ПРОИЗВОДСТВО
              </p>
              <h2 className="mt-5 max-w-[520px] text-[clamp(2.125rem,8vw,2.5rem)] font-black leading-[1.04] tracking-[-0.03em] text-primary lg:text-[clamp(2.125rem,3.2vw,3.25rem)] lg:leading-[1.02]">
                Производство дисков
              </h2>
              <p className="production-lead font-heading mt-4 max-w-[460px] text-xl font-bold leading-[1.25] sm:text-[22px] lg:text-2xl">
                Под любые параметры
              </p>
              <span className="production-accent-line mt-[18px] block h-0.5 w-16" aria-hidden="true" />
            </Reveal>

            <Reveal delay={0.12}>
              <p className="production-copy mt-7 max-w-[460px] text-[15px] leading-[1.65] sm:text-base">
                Каждый комплект PRIDE Forged изготавливается под конкретный автомобиль: параметры, посадку, тормозную систему и желаемый внешний вид. Мы контролируем геометрию, прочность, массу и качество отделки на каждом этапе производства.
              </p>
              <p className="production-copy mt-3.5 max-w-[460px] text-[15px] leading-[1.6] sm:text-base">
                Это позволяет получить комплект, который точно подходит автомобилю и выглядит цельно в готовом проекте.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-7">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/about">Подробнее про производство</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} amount={0.12} className="production-image-area relative z-0 aspect-[4/3] overflow-hidden lg:min-h-[560px] lg:aspect-auto">
            <Image
              src={productionImage}
              alt="Чёрный кованый диск на производстве PRIDE Forged"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="production-image object-cover object-[50%_54%]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
