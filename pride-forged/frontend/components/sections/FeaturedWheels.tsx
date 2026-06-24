"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

import { getWheelImageOrFallback } from "@/components/catalog/WheelCard";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Reveal } from "@/components/ui/reveal";
import type { Wheel } from "@/lib/api";
import { sortWheelsByCatalogOrder } from "@/lib/assets";
import { cn } from "@/lib/utils";

const carousel: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const card: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

export function FeaturedWheels({ wheels }: { wheels: Wheel[] }) {
  const shouldReduceMotion = useReducedMotion();
  const featured = sortWheelsByCatalogOrder(wheels).slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const suppressClickRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(container.scrollLeft > 5);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 5);
  }, []);

  const scrollModels = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.querySelector<HTMLElement>("[data-featured-wheel-card]");
    const gap = Number.parseFloat(window.getComputedStyle(container).columnGap || "0");
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth * 0.85;
    const scrollAmount = Math.round(cardWidth + gap);

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  }, []);

  const handleDragStart = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;

    if (!container || event.button !== 0) {
      return;
    }

    setIsDragging(true);
    suppressClickRef.current = false;
    startXRef.current = event.pageX;
    scrollStartRef.current = container.scrollLeft;
  }, []);

  const handleDragMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;

    if (!container || !isDragging) {
      return;
    }

    const delta = event.pageX - startXRef.current;

    if (Math.abs(delta) > 6) {
      suppressClickRef.current = true;
      event.preventDefault();
    }

    container.scrollLeft = scrollStartRef.current - delta;
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);
    updateScrollState();

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 160);
    }
  }, [isDragging, updateScrollState]);

  const handleCardClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 120);
  }, []);

  const handleSliderKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollModels("left");
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollModels("right");
    }
  }, [scrollModels]);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, featured.length]);

  return (
    <section className="overflow-hidden px-4 pb-14 pt-8 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="relative z-10 mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Каталог</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.06em] text-primary sm:text-6xl lg:text-7xl">
              Флагманские модели
            </h2>
          </div>
          <div className="relative z-10 flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <Link href="/catalog" className="text-sm font-semibold text-primary underline decoration-accent underline-offset-8 transition hover:text-accent">
              Все модели
            </Link>
            <div className="flex shrink-0 items-center gap-2" aria-label="Прокрутка флагманских моделей">
              <button
                type="button"
                aria-label="Прокрутить модели влево"
                disabled={!canScrollLeft}
                onClick={() => scrollModels("left")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_16px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_20px_58px_rgba(62,110,168,0.24)] disabled:translate-y-0 disabled:cursor-default disabled:opacity-35 disabled:shadow-none sm:h-11 sm:w-11"
              >
                <span aria-hidden="true" className="text-2xl leading-none">←</span>
              </button>
              <button
                type="button"
                aria-label="Прокрутить модели вправо"
                disabled={!canScrollRight}
                onClick={() => scrollModels("right")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_16px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_20px_58px_rgba(62,110,168,0.24)] disabled:translate-y-0 disabled:cursor-default disabled:opacity-35 disabled:shadow-none sm:h-11 sm:w-11"
              >
                <span aria-hidden="true" className="text-2xl leading-none">→</span>
              </button>
            </div>
          </div>
        </Reveal>
        {featured.length === 0 ? (
          <LiquidCard className="rounded-2xl p-8 text-center">
            <p className="text-2xl font-black text-primary">Каталог временно недоступен</p>
            <p className="mt-3 text-graphite">Попробуйте обновить страницу или откройте каталог позже.</p>
          </LiquidCard>
        ) : (
          <motion.div
            ref={scrollRef}
            data-featured-wheels-scroll
            tabIndex={0}
            aria-label="Флагманские модели дисков PRIDE"
            variants={carousel}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onKeyDown={handleSliderKeyDown}
            className={cn(
              "no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-4 outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            )}
          >
            {featured.map((wheel, index) => (
              <motion.div key={wheel.slug} data-featured-wheel-card variants={card} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }} className="w-[calc(100vw-2rem)] flex-none snap-start sm:w-[380px] md:w-[420px] lg:w-[520px]">
                <Link href={`/catalog/${wheel.slug}`} draggable={false} onClick={handleCardClick} className="block h-full">
                  <LiquidCard interactive className="wheel-card group h-full overflow-hidden p-4 transition duration-500 ease-out hover:border-accent/40 hover:shadow-[0_28px_82px_rgb(var(--accent-rgb)/0.18)] sm:p-6">
                    <div className="mesh-card relative flex aspect-[1.18] items-center justify-center overflow-hidden rounded-[1.7rem]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgb(var(--text-primary-rgb)/0.12),transparent_38%)]" />
                      <Image
                        src={getWheelImageOrFallback(wheel)}
                        alt={`Кованый диск ${wheel.name}`}
                        width={1100}
                        height={950}
                        draggable={false}
                        className="wheel-card-image relative h-[86%] w-[86%] object-contain drop-shadow-[0_30px_55px_rgba(13,27,42,0.22)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-3xl font-black tracking-tight text-primary">{wheel.name}</h3>
                      </div>
                      <span className="rounded-full border border-primary/10 bg-surface/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        forged
                      </span>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-surface/55 p-3"><span className="block text-graphite/70">Параметры</span><b className="text-primary">по запросу</b></div>
                      <div className="rounded-2xl bg-surface/55 p-3"><span className="block text-graphite/70">Цена</span><b className="text-primary">по запросу</b></div>
                    </div>
                  </LiquidCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
