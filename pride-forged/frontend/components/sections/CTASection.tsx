import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white p-8 text-primary shadow-premium sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Консультация</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-black sm:text-5xl">Нужны параметры под конкретный автомобиль?</h2>
          <Button asChild size="lg" variant="secondary"><Link href="/contact">Связаться с PRIDE</Link></Button>
        </div>
      </div>
    </section>
  );
}
