import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const paintImage = "/images/paint/purple-wheel-paint.jpg";

export function PaintSection() {
  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="paint-panel relative isolate overflow-hidden rounded-[28px] border border-[var(--border)] sm:rounded-[36px] lg:grid lg:min-h-[560px] lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:rounded-[40px]">
          <Reveal delay={0.08} amount={0.12} className="paint-image-area relative z-0 aspect-[4/3] overflow-hidden lg:min-h-[560px] lg:aspect-auto">
            <Image
              src={paintImage}
              alt="Фиолетовая комбинированная отделка кованых дисков"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="paint-image object-cover object-[50%_48%]"
            />
          </Reveal>

          <div className="paint-copy-area relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[560px] lg:px-14 lg:py-16 xl:px-16">
            <div className="paint-copy-inner max-w-[460px]">
              <Reveal>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent opacity-90">
                  ПОКРАСКА ДИСКОВ
                </p>
                <h2 className="mt-4 text-[clamp(2.125rem,8vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-primary lg:text-[clamp(2.125rem,3vw,3rem)]">
                  Покраска дисков
                </h2>
                <p className="paint-lead mt-3 text-xl font-semibold leading-[1.3]">
                  В любой цвет и текстуру
                </p>
                <span className="paint-accent-line mt-[18px] block h-0.5 w-16" aria-hidden="true" />
              </Reveal>

              <Reveal delay={0.12}>
                <p className="paint-copy mt-[26px] max-w-[420px] text-[15px] leading-[1.65]">
                  Наша команда использует жидкие и порошковые покрытия для достижения особого, а зачастую и уникального вида кованых дисков. Мы всегда находимся в процессе исследования новых цветов и их сочетаний, чтобы предложить клиентам действительно индивидуальный результат.
                </p>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="mt-7">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/contact">Подробнее про покраску</Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
