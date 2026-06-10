"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { carsLineupImage } from "@/lib/assets";
import { cn } from "@/lib/utils";

type WheelType = "Моноблоки" | "Двухсоставные";
type OpenPanel = "type" | "diameter" | "widthEt" | null;

const MM_PER_INCH = 25.4;

const wheelTypes: WheelType[] = ["Моноблоки", "Двухсоставные"];
const diameterOptions = [17, 18, 19, 20, 21, 22, 23];
const widthOptions = [8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0];
const etOptions = [16, 17, 18, 19, 20, 21, 22, 23, 24];

function formatRub(value: number) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function formatWidth(value: number) {
  return `${value.toFixed(1)}J`;
}

function getPositions(width: number, et: number) {
  const widthMm = width * MM_PER_INCH;
  return {
    widthMm,
    outerPosition: widthMm / 2 - et,
    innerPosition: widthMm / 2 + et
  };
}

function optionWindow<T>(options: T[], current: T, radius = 1) {
  const index = Math.max(0, options.findIndex((option) => option === current));
  return options.slice(Math.max(0, index - radius), Math.min(options.length, index + radius + 1));
}

function PickerRail({
  label,
  value,
  options,
  format,
  onChange
}: {
  label: string;
  value: number;
  options: number[];
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const currentIndex = options.indexOf(value);

  function step(direction: -1 | 1) {
    const next = options[Math.min(options.length - 1, Math.max(0, currentIndex + direction))];
    onChange(next);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-3xl font-light text-primary transition hover:bg-primary/10"
          aria-label={`Уменьшить ${label}`}
        >
          ‹
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="flex items-end justify-center gap-5 text-lg font-black text-graphite/55 sm:text-xl">
            {optionWindow(options, value).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={cn(
                  "flex flex-col items-center gap-3 transition duration-300",
                  option === value ? "scale-125 text-primary" : "hover:text-primary/80"
                )}
              >
                <span className="h-7 w-1 rounded-full bg-primary/10" />
                {format(option)}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-3xl font-light text-primary transition hover:bg-primary/10"
          aria-label={`Увеличить ${label}`}
        >
          ›
        </button>
      </div>
      <p className="text-center text-sm font-black uppercase tracking-[0.08em] text-graphite">{label}</p>
    </div>
  );
}

function FitmentSelectorPanel({
  active,
  children
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[60] mt-4 box-border w-full max-w-full overflow-visible rounded-[28px] border border-primary/12 bg-surface p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18),inset_0_1px_0_rgb(var(--text-primary-rgb)/0.10)] backdrop-blur-2xl"
        >
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FitmentGridPicker({
  label,
  value,
  options,
  format,
  onChange,
  variant
}: {
  label: string;
  value: number;
  options: number[];
  format: (value: number) => string;
  onChange: (value: number) => void;
  variant: "width" | "et";
}) {
  return (
    <div className="box-border w-full max-w-full min-w-0">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-graphite sm:text-[13px]">
        {label}
      </p>
      <div
        className={cn(
          "grid w-full min-w-0 gap-3",
          variant === "width" ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "grid-cols-3 sm:grid-cols-4 xl:grid-cols-5"
        )}
      >
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "flex h-12 w-full min-w-0 items-center justify-center rounded-2xl border px-2 text-center text-base font-extrabold leading-none whitespace-nowrap transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-primary sm:text-lg",
                active
                  ? "border-accent bg-accent text-white shadow-[0_16px_42px_rgba(62,110,168,0.28)] hover:text-white"
                  : "border-primary/10 bg-background/60 text-graphite hover:bg-background/85"
              )}
              aria-pressed={active}
            >
              {format(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TypePicker({ value, onChange }: { value: WheelType; onChange: (value: WheelType) => void }) {
  return (
    <div className="grid w-full max-w-full min-w-0 grid-cols-1 gap-3 rounded-[28px] border border-primary/10 bg-background/55 p-3 xl:grid-cols-2">
      {wheelTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "box-border flex h-14 w-full min-w-0 max-w-full items-center justify-center overflow-hidden rounded-2xl border px-4 text-center text-base font-bold leading-tight whitespace-normal break-words transition duration-300 hover:-translate-y-0.5 sm:text-lg xl:h-16 xl:text-xl",
            value === type
              ? "border-accent/55 bg-accent text-white shadow-[0_18px_48px_rgba(62,110,168,0.32)]"
              : "border-primary/10 bg-background/55 text-graphite hover:border-primary/25 hover:bg-background/85 hover:text-primary"
          )}
        >
          <span className="min-w-0 max-w-full whitespace-normal break-words">
            {type === "Двухсоставные" ? (
              <>
                <span className="sm:hidden">2-составные</span>
                <span className="hidden sm:inline">Двухсоставные</span>
              </>
            ) : (
              type
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

function SelectorPanel({
  active,
  children
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[60] mt-3 max-h-[280px] overflow-y-auto rounded-[24px] border border-primary/12 bg-surface/95 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.18),inset_0_1px_0_rgb(var(--text-primary-rgb)/0.10)] backdrop-blur-2xl"
        >
          <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SelectorCard({
  title,
  value,
  open,
  onClick
}: {
  title: string;
  value: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-24 w-full items-center justify-between gap-5 rounded-[24px] border border-primary/10 bg-surface/80 px-6 py-[22px] text-left shadow-[inset_0_1px_0_rgb(var(--text-primary-rgb)/0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface hover:shadow-[0_20px_60px_rgba(62,110,168,0.16)] lg:min-h-28",
        open && "border-accent/50 bg-surface shadow-[0_24px_70px_rgba(62,110,168,0.18)]"
      )}
    >
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-graphite/70">{title}</span>
        <span className="mt-2 block truncate text-xl font-black text-primary lg:text-2xl">{value}</span>
      </span>
      <span className={cn("shrink-0 text-3xl leading-none text-accent transition duration-300", open ? "rotate-180" : "group-hover:translate-y-0.5")}>⌄</span>
    </button>
  );
}

function PriceFrame({
  summary,
  price
}: {
  summary: string;
  price: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-primary/15 bg-surface/80 p-6 shadow-[0_24px_72px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-7"
    >
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
      <motion.div
        aria-hidden="true"
        animate={{ x: ["-18%", "18%", "-18%"], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-8 h-32 w-72 rounded-full bg-accent/18 blur-3xl"
      />

      <div className="relative grid gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Итоговая конфигурация</p>
            <motion.p
              key={summary}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
              className="mt-3 inline-flex max-w-full rounded-full border border-primary/10 bg-background/60 px-5 py-3 text-sm font-bold text-primary"
            >
              {summary}
            </motion.p>
          </div>
          <Link
            href="/contact"
            className="metal-sheen inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-black text-white shadow-[0_16px_44px_rgba(62,110,168,0.28)] hover:-translate-y-0.5 hover:bg-accent/90 sm:w-auto"
          >
            Заказать
          </Link>
        </div>

        <motion.div
          key={price}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <p className="text-[clamp(2.25rem,5vw,4rem)] font-black leading-none tracking-[-0.04em] text-primary">
            {formatRub(price)}
          </p>
          <p className="mt-3 text-lg font-black text-primary/90 sm:text-xl">{formatRub(price / 4)} за один диск</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[24px] border border-primary/10 bg-surface/75 p-6 text-center shadow-[0_18px_54px_rgba(0,0,0,0.10)] backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-graphite">{label}</p>
      <p className="text-[clamp(1.875rem,4vw,2.75rem)] font-black leading-none tracking-[-0.03em] text-primary">{value}</p>
    </div>
  );
}

export function WheelCalculator() {
  const [wheelType, setWheelType] = useState<WheelType>("Моноблоки");
  const [diameter, setDiameter] = useState(20);
  const [width, setWidth] = useState(11.0);
  const [et, setEt] = useState(20);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const typeRef = useRef<HTMLDivElement | null>(null);
  const diameterRef = useRef<HTMLDivElement | null>(null);
  const widthEtRef = useRef<HTMLDivElement | null>(null);

  const oldWheel = { diameter: 19, width: 9.5, et: 35 };

  const calculations = useMemo(() => {
    const oldPositions = getPositions(oldWheel.width, oldWheel.et);
    const newPositions = getPositions(width, et);
    const outerChange = newPositions.outerPosition - oldPositions.outerPosition;
    const innerChange = newPositions.innerPosition - oldPositions.innerPosition;

    return {
      outerChange,
      innerChange,
      trackChange: outerChange * 2,
      widthDifference: newPositions.widthMm - oldPositions.widthMm,
      diameterDifference: diameter - oldWheel.diameter
    };
  }, [diameter, et, width]);

  const price = useMemo(() => {
    const typeMultiplier = wheelType === "Двухсоставные" ? 1.28 : 1;
    const base = 98000;
    const diameterAdd = (diameter - 17) * 7800;
    const widthAdd = Math.max(0, width - 9) * 9600;
    const etAdd = Math.abs(et - 30) * 520;
    return (base + diameterAdd + widthAdd + etAdd) * typeMultiplier;
  }, [diameter, et, wheelType, width]);

  const summary = `${wheelType}   ${diameter}R   ${formatWidth(width)} ET${et}`;

  useEffect(() => {
    function handlePointerOutside(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const clickedInsideType = typeRef.current?.contains(target);
      const clickedInsideDiameter = diameterRef.current?.contains(target);
      const clickedInsideWidthEt = widthEtRef.current?.contains(target);

      if (!clickedInsideType && !clickedInsideDiameter && !clickedInsideWidthEt) {
        setOpenPanel(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPanel(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function selectWheelType(value: WheelType) {
    setWheelType(value);
  }

  function selectDiameter(value: number) {
    setDiameter(value);
  }

  return (
    <main className="bg-background text-primary">
      <section className="calculator-hero relative isolate border-b border-primary/10 bg-background px-5 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-[72px] lg:pt-[120px]">
        <Image
          src={carsLineupImage}
          alt="Автомобиль для примерки дисков PRIDE"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-34"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/48" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.12, 0.32, 0.12], x: [-24, 34, -24] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-24 h-px w-[36rem] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />

        <div className="relative mx-auto max-w-[1440px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[720px]"
          >
            <p className="text-sm font-black uppercase tracking-[0.16em] text-accent">PRIDE calculator</p>
            <h1 className="mt-4 text-[clamp(2.625rem,6vw,5.5rem)] font-black leading-[0.98] tracking-[-0.04em]">
              Калькулятор параметров
            </h1>
            <p className="mt-5 max-w-[620px] text-base font-semibold leading-[1.5] text-graphite sm:text-lg lg:text-xl">
              Настройте тип, диаметр, ширину и вылет в формате конфигуратора. Стоимость и посадка обновятся сразу.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="calculator-controls bg-background px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:items-start">
          <div ref={typeRef} className="box-border w-full max-w-full min-w-0">
            <SelectorCard title="Тип дисков" value={wheelType} open={openPanel === "type"} onClick={() => setOpenPanel(openPanel === "type" ? null : "type")} />
            <SelectorPanel active={openPanel === "type"}>
              <TypePicker value={wheelType} onChange={selectWheelType} />
            </SelectorPanel>
          </div>
          <div ref={diameterRef} className="min-w-0">
            <SelectorCard title="Диаметр" value={`${diameter}"`} open={openPanel === "diameter"} onClick={() => setOpenPanel(openPanel === "diameter" ? null : "diameter")} />
            <SelectorPanel active={openPanel === "diameter"}>
              <PickerRail label="Диаметр дисков" value={diameter} options={diameterOptions} format={(value) => `${value}`} onChange={selectDiameter} />
            </SelectorPanel>
          </div>
          <div ref={widthEtRef} className="min-w-0 md:col-span-2 lg:col-span-1">
            <SelectorCard title="Ширина и вылет" value={`${formatWidth(width)} ET${et}`} open={openPanel === "widthEt"} onClick={() => setOpenPanel(openPanel === "widthEt" ? null : "widthEt")} />
            <FitmentSelectorPanel active={openPanel === "widthEt"}>
              <div className="flex w-full max-w-full flex-col gap-7 overflow-visible">
                <FitmentGridPicker label="Ширина дисков" value={width} options={widthOptions} format={(value) => value.toFixed(1)} onChange={setWidth} variant="width" />
                <FitmentGridPicker label="Вылет дисков (ET)" value={et} options={etOptions} format={(value) => `${value}`} onChange={setEt} variant="et" />
              </div>
            </FitmentSelectorPanel>
          </div>
        </div>
      </section>

      <section className="calculator-results bg-background px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <PriceFrame summary={summary} price={price} />

          <div className="grid gap-4 lg:gap-5">
            <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
              <Metric label="Выступ наружу" value={`${calculations.outerChange > 0 ? "+" : ""}${calculations.outerChange.toFixed(1)} мм`} />
              <Metric label="Уход внутрь" value={`${calculations.innerChange > 0 ? "+" : ""}${calculations.innerChange.toFixed(1)} мм`} />
              <Metric label="Колея" value={`${calculations.trackChange > 0 ? "+" : ""}${calculations.trackChange.toFixed(1)} мм`} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              <Metric label="Разница ширины" value={`${calculations.widthDifference > 0 ? "+" : ""}${calculations.widthDifference.toFixed(1)} мм`} />
              <Metric label="Разница диаметра" value={`${calculations.diameterDifference > 0 ? "+" : ""}${calculations.diameterDifference.toFixed(1)}"`} />
            </div>
          </div>
        </div>
      </section>

      <section className="calculator-cta bg-background px-5 pb-14 pt-2 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 rounded-[28px] border border-primary/10 bg-surface/70 p-6 text-graphite backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <p className="max-w-2xl leading-7">
            Расчет предварительный. Финальные параметры зависят от тормозной системы, подвески и желаемой посадки.
          </p>
          <Button asChild>
            <Link href="/fitment">Подобрать по автомобилю</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
