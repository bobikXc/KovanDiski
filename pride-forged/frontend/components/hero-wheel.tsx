"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

const spokes = Array.from({ length: 10 }, (_, index) => index * 36);
const lugHoles = Array.from({ length: 5 }, (_, index) => index * 72 + 18);

export function HeroWheel() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 80]);
  const parallaxRotate = useTransform(scrollY, [0, 700], [0, 12]);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(
          wheel,
          { xPercent: 92, opacity: 0, rotate: -120, scale: 0.86 },
          { xPercent: 0, opacity: 1, rotate: 360, scale: 1, duration: 1.55 }
        )
        .to(wheel, { rotate: 372, duration: 0.42, ease: "power2.out" })
        .to(wheel, { rotate: "+=360", duration: 26, ease: "none", repeat: -1 });
    }, wheelRef);

    return () => context.revert();
  }, []);

  return (
    <motion.div style={{ y: parallaxY, rotate: parallaxRotate }} className="relative mx-auto aspect-square w-full max-w-[680px]">
      <div className="absolute inset-[10%] rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute inset-[19%] rounded-full bg-white/75 blur-2xl" />
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/20 shadow-[inset_0_0_80px_rgba(255,255,255,0.7)]" />
      <div ref={wheelRef} className="relative z-10 flex h-full w-full items-center justify-center drop-shadow-[0_46px_70px_rgba(13,27,42,0.30)] will-change-transform">
        <svg viewBox="0 0 640 640" role="img" aria-label="Премиальный кованый диск PRIDE Forged" className="h-full w-full">
          <defs>
            <radialGradient id="wheel-face" cx="38%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="46%" stopColor="#DDE3EA" />
              <stop offset="100%" stopColor="#8D98A6" />
            </radialGradient>
            <linearGradient id="spoke-metal" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#C8D0DA" />
              <stop offset="100%" stopColor="#F7F8FA" />
            </linearGradient>
            <filter id="inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0D1B2A" floodOpacity="0.22" />
            </filter>
          </defs>

          <circle cx="320" cy="320" r="286" fill="url(#wheel-face)" filter="url(#inner-shadow)" />
          <circle cx="320" cy="320" r="260" fill="none" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="18" />
          <circle cx="320" cy="320" r="220" fill="#111E2B" opacity="0.96" />
          <circle cx="320" cy="320" r="206" fill="none" stroke="#F7F8FA" strokeOpacity="0.42" strokeWidth="10" />

          {spokes.map((rotation) => (
            <g key={rotation} transform={`rotate(${rotation} 320 320)`}>
              <path d="M303 121 C313 105 327 105 337 121 L358 302 C361 331 279 331 282 302 Z" fill="url(#spoke-metal)" />
              <path d="M318 145 L330 290" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="5" strokeLinecap="round" />
              <path d="M286 152 C255 183 240 220 236 260" stroke="#F7F8FA" strokeOpacity="0.32" strokeWidth="10" strokeLinecap="round" />
            </g>
          ))}

          <circle cx="320" cy="320" r="95" fill="#EFF3F7" stroke="#FFFFFF" strokeWidth="10" />
          <circle cx="320" cy="320" r="60" fill="#0D1B2A" />
          <circle cx="320" cy="320" r="34" fill="#4A6FA5" opacity="0.9" />

          {lugHoles.map((rotation) => (
            <circle key={rotation} cx="320" cy="232" r="17" fill="#0D1B2A" transform={`rotate(${rotation} 320 320)`} />
          ))}

          <circle cx="320" cy="320" r="286" fill="none" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="8" />
          <circle cx="320" cy="320" r="304" fill="none" stroke="#D9E1EA" strokeWidth="10" />
        </svg>
      </div>
    </motion.div>
  );
}
