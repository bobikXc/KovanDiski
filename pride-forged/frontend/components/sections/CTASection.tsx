"use client";

import Image from "next/image";

import { TrackedLink } from "@/components/tracked-link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CTASection() {
  return (
    <section className="overflow-hidden pb-16 pt-8 sm:py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-stretch lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]">
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Консультация</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-none tracking-[-0.06em] text-primary sm:text-6xl lg:text-[4rem]">
              Соберём комплект<br />
              под ваш автомобиль<br />
              и стиль вождения
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
              Оставьте заявку — специалист PRIDE уточнит параметры, предложит дизайн и рассчитает стоимость производства.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Button asChild size="lg" variant="secondary" className="mt-8 w-full shadow-[0_18px_40px_rgba(74,111,165,0.28)] sm:w-auto">
              <TrackedLink href="/contact" goal="click_lead_request" params={{ location: "cta_section" }}>Связаться с PRIDE</TrackedLink>
            </Button>
          </Reveal>
        </div>

        <Reveal className="about-consultation-visual" delay={0.08} amount={0.12}>
          <div className="about-consultation-image-shell">
            <Image
              src="/images/IMG_3166.JPG"
              alt="Кованый диск на автомобиле PRIDE"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="about-consultation-image"
            />
            <div className="about-consultation-image-overlay" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
