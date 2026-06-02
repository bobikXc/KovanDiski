"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Brand } from "@/lib/api";

const modelOptions: Record<string, string[]> = {
  bmw: ["m3", "m4", "m5", "x5m", "x6m"],
  mercedes: ["c63-amg", "e63-amg", "g63-amg"],
  audi: ["rs6", "rs7", "rsq8"],
  porsche: ["911", "panamera", "cayenne-coupe"],
  tesla: ["model-3", "model-s", "model-x"]
};

const selectorClass = "h-14 rounded-full border border-white/10 bg-secondary/90 px-5 text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

type SelectorForm = { brand: string; model: string };

export function VehicleSelector({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<SelectorForm>({ defaultValues: { brand: brands[0]?.slug ?? "bmw", model: "" } });
  const selectedBrand = watch("brand");
  const models = useMemo(() => modelOptions[selectedBrand] ?? [], [selectedBrand]);

  function onSubmit(values: SelectorForm) {
    router.push(values.model ? `/cars/${values.brand}/${values.model}` : `/cars/${values.brand}`);
  }

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="relative mx-auto max-w-6xl overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Fitment concierge</p>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">Подбор по автомобилю</h2>
              <p className="mt-5 leading-8 text-white/64">
                Выберите марку и модель — мы предложим безопасную посадку, нужную ширину, вылет и визуальный stance без догадок.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <label className="grid gap-2 text-sm text-white/60">
                Марка
                <select {...register("brand")} className={selectorClass}>
                  {brands.map((brand) => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-white/60">
                Модель
                <select {...register("model")} className={selectorClass}>
                  <option value="">Любая модель</option>
                  {models.map((model) => <option key={model} value={model}>{model.toUpperCase()}</option>)}
                </select>
              </label>
              <div className="flex items-end">
                <Button type="submit" size="lg" variant="secondary" className="w-full md:w-auto">Подобрать</Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
