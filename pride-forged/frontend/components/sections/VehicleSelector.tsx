"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

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

type SelectorForm = { brand: string; model: string };

export function VehicleSelector({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<SelectorForm>({ defaultValues: { brand: brands[0]?.slug ?? "bmw" } });
  const selectedBrand = watch("brand");
  const models = useMemo(() => modelOptions[selectedBrand] ?? [], [selectedBrand]);

  function onSubmit(values: SelectorForm) {
    router.push(values.model ? `/cars/${values.brand}/${values.model}` : `/cars/${values.brand}`);
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-5xl p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Fitment</p>
        <h2 className="mt-4 text-3xl font-black sm:text-5xl">Подбор по автомобилю</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <select {...register("brand")} className="h-12 rounded-full border border-white/10 bg-secondary px-5 text-white">
            {brands.map((brand) => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}
          </select>
          <select {...register("model")} className="h-12 rounded-full border border-white/10 bg-secondary px-5 text-white">
            <option value="">Любая модель</option>
            {models.map((model) => <option key={model} value={model}>{model.toUpperCase()}</option>)}
          </select>
          <Button type="submit" size="lg" variant="secondary">Подобрать</Button>
        </form>
      </Card>
    </section>
  );
}
