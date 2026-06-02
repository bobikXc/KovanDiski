"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WheelCard } from "@/components/catalog/WheelCard";
import type { Wheel } from "@/lib/api";

export function FeaturedWheels({ wheels }: { wheels: Wheel[] }) {
  const featured = wheels.slice(0, 6);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Каталог</p>
            <h2 className="mt-4 text-3xl font-black sm:text-5xl lg:text-6xl">Флагманские модели</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-white underline decoration-accent underline-offset-8 transition hover:text-accent">
            Все модели
          </Link>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((wheel, index) => (
            <motion.div
              key={wheel.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <WheelCard wheel={wheel} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
