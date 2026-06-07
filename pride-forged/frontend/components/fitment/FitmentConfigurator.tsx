"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { getWheelImageOrFallback, WheelCard } from "@/components/catalog/WheelCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { LiquidCard } from "@/components/ui/liquid-card";
import { carsLineupImage } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { type Brand, type Fitment, type VehicleModel, type Wheel, getBrands, getFitments, getModels, getWheels } from "@/lib/api";

const diameters = ["19", "20", "21", "22", "23"];

const styles = [
  "Спортивный",
  "Премиальный",
  "Минималистичный",
  "Агрессивный",
  "Индивидуальный"
] as const;

type FitmentStyle = (typeof styles)[number];
type SelectionMode = "car" | "wheel";

const styleWheelNames: Record<FitmentStyle, string[]> = {
  "Спортивный": ["PRIDE GT", "PRIDE RS", "PRIDE Evo"],
  "Премиальный": ["PRIDE Apex", "PRIDE Titan", "PRIDE Nero"],
  "Минималистичный": ["PRIDE Mono", "PRIDE Vector"],
  "Агрессивный": ["PRIDE Storm", "PRIDE Blade", "PRIDE Vortex"],
  "Индивидуальный": []
};

const fallbackSpecs = ["Индивидуальная ширина", "ET под тормозную систему", "PCD и DIA по автомобилю"];

function normalize(value?: string) {
  return value?.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "") ?? "";
}

function getRecommendedSpecs(brand?: Brand, model?: VehicleModel, diameter?: string) {
  const brandName = normalize(brand?.name);
  const modelName = normalize(model?.name);

  if (brandName.includes("bmw") && (modelName.includes("m3") || modelName.includes("m4"))) {
    return ["20x10 ET20", "20x11 ET35"];
  }
  if (brandName.includes("bmw") && modelName.includes("m5")) {
    return ["21x10.5 ET20", "22x11.5 ET18"];
  }
  if (brandName.includes("bmw") && (modelName.includes("x5m") || modelName.includes("x6m"))) {
    return ["22x10.5 ET25", "23x11.5 ET30"];
  }
  if (brandName.includes("mercedes") && (modelName.includes("c63") || modelName.includes("e63"))) {
    return ["20x9.5 ET25", "20x10.5 ET35"];
  }
  if (brandName.includes("mercedes") && modelName.includes("g63")) {
    return ["22x10 ET35", "23x10.5 ET30"];
  }
  if (brandName.includes("audi") && (modelName.includes("rs6") || modelName.includes("rs7"))) {
    return ["21x10.5 ET22", "22x10.5 ET20"];
  }
  if (brandName.includes("audi") && modelName.includes("rsq8")) {
    return ["22x10.5 ET20", "23x11 ET25"];
  }
  if (brandName.includes("porsche") && modelName.includes("911")) {
    return ["20x9 ET45", "21x11.5 ET55"];
  }
  if (brandName.includes("porsche") && modelName.includes("panamera")) {
    return ["21x10 ET35", "21x11 ET45"];
  }
  if (brandName.includes("porsche") && modelName.includes("cayenne")) {
    return ["22x10.5 ET28", "23x11 ET30"];
  }
  if (brandName.includes("tesla") && modelName.includes("model3")) {
    return ["19x9 ET35", "20x9.5 ET35"];
  }
  if (brandName.includes("tesla") && modelName.includes("models")) {
    return ["21x9.5 ET35", "21x10.5 ET40"];
  }
  if (brandName.includes("tesla") && modelName.includes("modelx")) {
    return ["22x10 ET35", "22x10.5 ET40"];
  }

  return diameter ? [`${diameter}x9 ET35`, `${diameter}x10 ET40`] : fallbackSpecs;
}

function getYearOptions(model?: VehicleModel) {
  if (!model?.year_from) {
    return [];
  }

  const currentYear = 2026;
  const yearTo = model.year_to ?? currentYear;
  return Array.from({ length: yearTo - model.year_from + 1 }, (_, index) => String(yearTo - index));
}

function getYearLabel(model?: VehicleModel) {
  if (!model?.year_from) {
    return "Годы выпуска уточняются";
  }

  return model.year_to ? `${model.year_from}-${model.year_to}` : `${model.year_from}-н.в.`;
}

function pickWheels(wheels: Wheel[], style?: FitmentStyle) {
  if (wheels.length === 0) {
    return [];
  }

  if (!style || style === "Индивидуальный") {
    return wheels.slice(0, 6);
  }

  const preferredNames = styleWheelNames[style].map(normalize);
  const preferred = wheels.filter((wheel) => preferredNames.includes(normalize(wheel.name)));

  if (preferred.length === 0) {
    return wheels.slice(0, 6);
  }

  const preferredSlugs = new Set(preferred.map((wheel) => wheel.slug));
  const filled = [
    ...preferred,
    ...wheels.filter((wheel) => !preferredSlugs.has(wheel.slug))
  ];

  return filled.slice(0, 6);
}

function Field({
  label,
  value,
  onChange,
  disabled,
  children
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-graphite/70">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-primary/10 bg-surface/70 px-4 text-sm font-semibold text-primary shadow-[inset_0_1px_0_rgba(244,247,251,0.08),0_18px_45px_rgba(0,0,0,0.16)] outline-none backdrop-blur-xl transition duration-300 hover:border-accent/45 focus:border-accent focus:ring-4 focus:ring-accent/15 disabled:cursor-not-allowed disabled:bg-surface/35 disabled:text-graphite/35"
      >
        {children}
      </select>
    </label>
  );
}

function StepBadge({ index, title, active }: { index: number; title: string; active: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-2xl border px-4 py-3 transition duration-300",
      active ? "border-accent/35 bg-surface/80 text-primary shadow-[0_18px_44px_rgba(0,0,0,0.18)]" : "border-primary/10 bg-surface/35 text-graphite/60"
    )}>
      <span className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black",
        active ? "bg-accent text-white" : "bg-surface/80 text-graphite/60"
      )}>
        {index}
      </span>
      <span className="text-sm font-semibold">{title}</span>
    </div>
  );
}

export function FitmentConfigurator() {
  const [activeMode, setActiveMode] = useState<SelectionMode>("car");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [wheels, setWheels] = useState<Wheel[]>([]);
  const [fitments, setFitments] = useState<Fitment[]>([]);
  const [brandSlug, setBrandSlug] = useState("");
  const [modelSlug, setModelSlug] = useState("");
  const [year, setYear] = useState("");
  const [diameter, setDiameter] = useState("");
  const [style, setStyle] = useState<FitmentStyle | "">("");
  const [wheelSlug, setWheelSlug] = useState("");
  const [wheelDiameter, setWheelDiameter] = useState("");
  const [wheelStyle, setWheelStyle] = useState<FitmentStyle | "">("");
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([getBrands(), getWheels(), getFitments()])
      .then(([brandData, wheelData, fitmentData]) => {
        if (!mounted) {
          return;
        }
        setError("");
        setBrands(brandData);
        setWheels(wheelData);
        setFitments(fitmentData);
      })
      .catch(() => {
        if (mounted) {
          setError("Не удалось загрузить данные для подбора. Проверьте подключение к API.");
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingBrands(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!brandSlug) {
      setModels([]);
      setModelSlug("");
      setYear("");
      return;
    }

    let mounted = true;
    setIsLoadingModels(true);
    setModelSlug("");
    setYear("");

    getModels(brandSlug)
      .then((modelData) => {
        if (mounted) {
          setError("");
          setModels(modelData);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Не удалось загрузить модели выбранной марки.");
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingModels(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [brandSlug]);

  const selectedBrand = useMemo(() => brands.find((brand) => brand.slug === brandSlug), [brands, brandSlug]);
  const selectedModel = useMemo(() => models.find((model) => model.slug === modelSlug), [models, modelSlug]);
  const yearOptions = useMemo(() => getYearOptions(selectedModel), [selectedModel]);
  const specs = useMemo(() => getRecommendedSpecs(selectedBrand, selectedModel, diameter), [selectedBrand, selectedModel, diameter]);
  const recommendedWheels = useMemo(() => pickWheels(wheels, style || undefined), [wheels, style]);
  const isComplete = Boolean(selectedBrand && selectedModel && year && diameter && style);
  const selectedWheel = useMemo(() => wheels.find((wheel) => wheel.slug === wheelSlug), [wheelSlug, wheels]);
  const wheelModeDiameters = useMemo(
    () => Array.from(new Set(wheels.map((wheel) => String(wheel.diameter)))).sort((a, b) => Number(a) - Number(b)),
    [wheels]
  );
  const compatibleFitments = useMemo(
    () => fitments.filter((fitment) => fitment.wheel.slug === wheelSlug),
    [fitments, wheelSlug]
  );
  const wheelModeComplete = Boolean(selectedWheel && wheelDiameter && wheelStyle);

  function handleBrandChange(value: string) {
    setBrandSlug(value);
    setModelSlug("");
    setYear("");
    setDiameter("");
    setStyle("");
  }

  function handleModelChange(value: string) {
    setModelSlug(value);
    setYear("");
    setDiameter("");
    setStyle("");
  }

  function handleYearChange(value: string) {
    setYear(value);
    setDiameter("");
    setStyle("");
  }

  function handleDiameterChange(value: string) {
    setDiameter(value);
    setStyle("");
  }

  function handleWheelChange(value: string) {
    setWheelSlug(value);
    const wheel = wheels.find((item) => item.slug === value);
    setWheelDiameter(wheel ? String(wheel.diameter) : "");
    setWheelStyle("");
  }

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute -right-52 top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/14 blur-3xl" />
      <div className="absolute -left-52 top-[34rem] -z-10 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <LiquidCard className="relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-12">
            <div className="absolute inset-0">
              <Image
                src={carsLineupImage}
                alt="Линейка автомобилей для подбора дисков PRIDE"
                fill
                priority
                sizes="1180px"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/82 to-background/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
            <div className="absolute right-[-7rem] top-[-9rem] h-80 w-80 rounded-full bg-accent/18 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">PRIDE Selection</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black leading-none text-primary sm:text-6xl lg:text-7xl">
                  Подбор дисков
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-graphite">
                  Выберите сценарий: начните с автомобиля или с понравившейся модели диска. Конфигуратор покажет предварительные параметры, совместимость и следующий шаг.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <StepBadge index={1} title="Автомобиль" active={Boolean(selectedBrand || selectedModel)} />
                <StepBadge index={2} title="Параметры" active={Boolean(year || diameter || style)} />
              </div>
            </div>
          </LiquidCard>
        </motion.div>

        <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-primary/10 bg-surface/40 p-2 sm:inline-grid sm:grid-cols-2">
          {[
            ["car", "Подбор по автомобилю"],
            ["wheel", "Подбор по модели диска"]
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveMode(mode as SelectionMode)}
              className={cn(
                "rounded-[1.15rem] px-5 py-3 text-sm font-semibold transition duration-300",
                activeMode === mode
                  ? "bg-accent text-white shadow-[0_16px_42px_rgba(62,110,168,0.28)]"
                  : "text-graphite hover:bg-surface/80 hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {activeMode === "car" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
            <LiquidCard className="rounded-[2rem] p-5 sm:p-7">
              <div className="grid gap-5">
                <Field label="1. Марка автомобиля" value={brandSlug} disabled={isLoadingBrands} onChange={handleBrandChange}>
                  <option value="">{isLoadingBrands ? "Загрузка марок..." : "Выберите марку"}</option>
                  {brands.map((brand) => (
                    <option key={brand.slug} value={brand.slug}>{brand.name}</option>
                  ))}
                </Field>

                <Field label="2. Модель" value={modelSlug} disabled={!brandSlug || isLoadingModels} onChange={handleModelChange}>
                  <option value="">{isLoadingModels ? "Загрузка моделей..." : "Выберите модель"}</option>
                  {models.map((model) => (
                    <option key={model.slug} value={model.slug}>{model.name}</option>
                  ))}
                </Field>

                <Field label="3. Год / поколение" value={year} disabled={!selectedModel} onChange={handleYearChange}>
                  <option value="">{selectedModel ? getYearLabel(selectedModel) : "Сначала выберите модель"}</option>
                  {yearOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Field>

                <Field label="4. Желаемый диаметр" value={diameter} disabled={!year} onChange={handleDiameterChange}>
                  <option value="">Выберите диаметр</option>
                  {diameters.map((option) => (
                    <option key={option} value={option}>{option} дюймов</option>
                  ))}
                </Field>

                <div>
                  <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-graphite/70">5. Стиль</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {styles.map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={!diameter}
                        onClick={() => setStyle(option)}
                        className={cn(
                          "min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-45",
                          style === option
                            ? "border-accent/45 bg-accent text-white shadow-[0_18px_44px_rgba(62,110,168,0.28)]"
                            : "border-primary/10 bg-surface/60 text-primary hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </LiquidCard>
          </motion.div>

          <div className="min-h-[34rem]">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <LiquidCard className="flex min-h-[34rem] items-center rounded-[2rem] p-6 sm:p-8">
                    {error ? (
                      <EmptyState title="Данные недоступны" description={error} />
                    ) : (
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Результат</p>
                        <h2 className="mt-4 text-3xl font-black text-primary sm:text-4xl">Заполните параметры подбора</h2>
                        <p className="mt-4 max-w-xl text-base leading-7 text-graphite/65">
                          После выбора марки, модели, года, диаметра и стиля здесь появятся рекомендуемые размеры и модели кованых дисков PRIDE.
                        </p>
                      </div>
                    )}
                  </LiquidCard>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  <LiquidCard className="rounded-[2rem] p-5 sm:p-7">
                    <div className="grid gap-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Рекомендация</p>
                          <h2 className="mt-3 text-3xl font-black text-primary">
                            {selectedBrand?.name} {selectedModel?.name}
                          </h2>
                          <p className="mt-2 text-sm text-graphite/60">
                            {year} год • {diameter}″ • стиль: {style}
                          </p>
                        </div>
                        <Button asChild size="lg" className="w-full sm:w-auto">
                          <Link href="/contact">Получить консультацию</Link>
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {specs.map((spec) => (
                          <div key={spec} className="rounded-2xl border border-primary/10 bg-surface/55 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite/45">Параметр</p>
                            <p className="mt-2 text-2xl font-black text-primary">{spec}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-accent/20 bg-accent/[0.07] p-4 text-sm leading-6 text-graphite/70">
                        Результаты подбора являются предварительными. Финальные параметры зависят от комплектации автомобиля, тормозной системы, подвески и желаемой посадки.
                      </div>

                      <div>
                        <div className="mb-4 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Модели PRIDE</p>
                            <h3 className="mt-2 text-2xl font-black text-primary">Подходящие диски</h3>
                          </div>
                          <span className="hidden rounded-full border border-primary/10 bg-surface/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-graphite/70 sm:inline-flex">
                            {recommendedWheels.length} моделей
                          </span>
                        </div>

                        {recommendedWheels.length === 0 ? (
                          <EmptyState title="Каталог пока пуст" description="API вернул пустой список дисков. После наполнения каталога здесь появятся рекомендации." />
                        ) : (
                          <div className="grid gap-4 sm:grid-cols-2">
                            {recommendedWheels.slice(0, 4).map((wheel, index) => (
                              <Link
                                key={wheel.slug}
                                href={`/catalog/${wheel.slug}`}
                                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-surface/60 p-3 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-surface"
                              >
                                <div className="mesh-card flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                                  <img src={getWheelImageOrFallback(wheel, index)} alt={wheel.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-110" />
                                </div>
                                <div>
                                  <p className="font-black text-primary">{wheel.name}</p>
                                  <p className="mt-1 text-xs text-graphite/55">
                                    {wheel.diameter}″ • {wheel.width}J • ET{wheel.et}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <LiquidCard className="rounded-[2rem] p-5 sm:p-7">
                <div className="grid gap-5">
                  <Field label="1. Модель диска" value={wheelSlug} disabled={isLoadingBrands || wheels.length === 0} onChange={handleWheelChange}>
                    <option value="">{isLoadingBrands ? "Загрузка моделей..." : "Выберите диск"}</option>
                    {wheels.map((wheel) => (
                      <option key={wheel.slug} value={wheel.slug}>{wheel.name}</option>
                    ))}
                  </Field>

                  <Field label="2. Диаметр" value={wheelDiameter} disabled={!selectedWheel} onChange={setWheelDiameter}>
                    <option value="">Выберите диаметр</option>
                    {wheelModeDiameters.map((option) => (
                      <option key={option} value={option}>{option} дюймов</option>
                    ))}
                  </Field>

                  <div>
                    <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-graphite/55">3. Стиль</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {styles.map((option) => (
                        <button
                          key={option}
                          type="button"
                          disabled={!wheelDiameter}
                          onClick={() => setWheelStyle(option)}
                          className={cn(
                            "min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-45",
                            wheelStyle === option
                              ? "border-accent/45 bg-accent text-white shadow-[0_18px_44px_rgba(62,110,168,0.28)]"
                              : "border-primary/10 bg-surface/60 text-primary hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </LiquidCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
              <LiquidCard className="min-h-[34rem] rounded-[2rem] p-5 sm:p-7">
                {!wheelModeComplete ? (
                  <div className="flex min-h-[30rem] items-center">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Совместимость</p>
                      <h2 className="mt-4 text-3xl font-black text-primary sm:text-4xl">Выберите модель диска</h2>
                      <p className="mt-4 max-w-xl text-base leading-7 text-graphite/65">
                        После выбора модели, диаметра и стиля здесь появится список совместимых автомобилей и быстрый переход к карточке диска.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="mesh-card relative aspect-square w-full max-w-[220px] overflow-hidden rounded-[1.5rem]">
                        {selectedWheel ? (
                          <img
                            src={getWheelImageOrFallback(selectedWheel)}
                            alt={selectedWheel.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Wheel selection</p>
                        <h2 className="mt-3 text-3xl font-black text-primary">{selectedWheel?.name}</h2>
                        <p className="mt-2 text-sm text-graphite/60">
                          {wheelDiameter}″ • стиль: {wheelStyle}
                        </p>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <Button asChild>
                            <Link href={selectedWheel ? `/catalog/${selectedWheel.slug}` : "/catalog"}>Открыть карточку</Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href="/tools/wheel-calculator">Проверить параметры</Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {selectedWheel ? [
                        ["Диаметр", `${selectedWheel.diameter}″`],
                        ["Ширина", `${selectedWheel.width}J`],
                        ["ET", `ET${selectedWheel.et}`]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-primary/10 bg-surface/55 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite/45">{label}</p>
                          <p className="mt-2 text-xl font-black text-primary">{value}</p>
                        </div>
                      )) : null}
                    </div>

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Compatible cars</p>
                      <h3 className="mt-2 text-2xl font-black text-primary">Совместимые автомобили</h3>
                      {compatibleFitments.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/[0.07] p-5 text-sm leading-6 text-graphite/70">
                          В базе пока нет жестко привязанных автомобилей для этой модели. Специалист PRIDE проверит PCD, DIA, тормозную систему и посадку вручную.
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {compatibleFitments.slice(0, 6).map((fitment) => (
                            <div key={fitment.id} className="rounded-2xl border border-primary/10 bg-surface/55 p-4">
                              <p className="font-black text-primary">{fitment.vehicle_model.name}</p>
                              <p className="mt-1 text-sm text-graphite/60">Проверенный fitment</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </LiquidCard>
            </motion.div>
          </div>
        )}

        {activeMode === "car" && recommendedWheels.length > 4 && isComplete ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedWheels.slice(4, 6).map((wheel, index) => (
              <WheelCard key={wheel.slug} wheel={wheel} index={index + 4} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
