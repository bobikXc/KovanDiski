"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type HeroSliderProps = {
  images: string[];
  intervalMs?: number;
};

export function HeroSlider({ images, intervalMs = 6000 }: HeroSliderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || images.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs, shouldReduceMotion]);

  const currentImage = images[currentIndex] ?? images[0];

  if (!currentImage) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="hero-slider-visual pointer-events-none absolute inset-0 z-0 lg:left-auto lg:right-0 lg:w-[58%]"
    >
      <div className="hero-slider-frame absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentImage}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015, x: -8 }}
            transition={{ duration: shouldReduceMotion ? 0.25 : 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage}
              alt=""
              fill
              priority={currentIndex === 0}
              sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 50vw, 92vw"
              className="object-cover object-[62%_center] lg:object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="hero-slider-overlay pointer-events-none absolute inset-0 z-10" />
        <div className="pointer-events-none absolute bottom-5 right-5 z-20 flex gap-1.5 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
          {images.map((image, index) => (
            <span
              key={image}
              className={`h-1 rounded-full transition-[width,opacity] duration-500 ${index === currentIndex ? "w-8 bg-accent opacity-100" : "w-3 bg-primary opacity-35"}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
