import Link from "next/link";

import { BeforeAfterSlider } from "@/components/before-after-slider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const beforeImage = "/images/grey-1212mercedes-benz-s580-s-class-brixton-forged-wheel-luxury-single-piece-8.png";
const afterImage = "/images/grey-mercedes-benz-s580-s-class-brixton-forged-wheel-luxury-single-piece-8.png";

export function VisualizationSection() {
  return (
    <section className="visualization-section overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="visualization-panel relative isolate w-full max-w-full overflow-hidden rounded-[28px] border border-[var(--border)] p-5 shadow-[var(--shadow-liquid)] sm:rounded-[36px] sm:p-8 lg:rounded-[40px] lg:p-10 xl:p-12">
          <div className="visualization-glow visualization-glow-one" />
          <div className="visualization-glow visualization-glow-two" />

          <div className="visualization-layout relative z-10 grid min-w-0 items-center gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10 xl:gap-16">
            <div className="visualization-copy min-w-0 max-w-[34rem] py-2 lg:py-8">
              <Reveal>
                <div className="visualization-label flex max-w-full items-center gap-3">
                  <span className="h-px w-8 bg-accent" />
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent sm:text-sm">Примерьте дизайн</p>
                </div>
                <h2 className="visualization-title mt-5 text-[2.45rem] font-black leading-[0.98] tracking-[-0.055em] text-primary sm:text-5xl lg:text-[3.25rem] xl:text-[3.7rem]">
                  Как будут выглядеть диски на вашем авто
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="visualization-description mt-6 max-w-lg text-base leading-7 text-graphite sm:text-lg sm:leading-8">
                  Получите бесплатную визуализацию понравившихся дисков на вашем автомобиле до изготовления комплекта.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8">
                  <Button asChild size="lg" className="visualization-cta w-full sm:w-auto">
                    <Link href="/contact">Получить визуализацию</Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.08} amount={0.16}>
              <BeforeAfterSlider
                beforeImage={beforeImage}
                afterImage={afterImage}
                beforeAlt="Mercedes-Benz S-Class до визуализации нового комплекта дисков"
                afterAlt="Mercedes-Benz S-Class после установки дисков PRIDE"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
