"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function Reveal({ children, className, delay = 0, amount = 0.18 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: amount });

  return (
    <motion.div
      ref={ref}
      data-reveal
      variants={revealVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion || inView ? "visible" : "hidden"}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.72, delay: Math.min(delay, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
