"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { carsLineupImage } from "@/lib/assets";
import { cn } from "@/lib/utils";

type WheelType = "Моноблоки" | "Двухсоставные";
type ActivePicker = "type" | "diameter" | "fitment" | null;

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

function TypePicker({ value, onChange }: { value: WheelType; onChange: (value: WheelType) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {wheelTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "rounded-2xl border px-5 py-5 text-left text-xl font-black transition duration-300 hover:-translate-y-0.5",
            value === type
              ? "border-accent/55 bg-accent text-white shadow-[0_18px_48px_rgba(62,110,168,0.32)]"
              : "border-primary/10 bg-background/55 text-graphite hover:border-primary/25 hover:bg-background/85 hover:text-primary"
          )}
        >
          {type}
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
          className="relative z-[60] mt-3 max-h-[280px] overflow-y-auto rounded-[1.6rem] border border-primary/12 bg-surface/95 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(244,247,251,0.10)] backdrop-blur-2xl"
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
        "group flex min-h-24 w-full items-center justify-between rounded-[1.7rem] border border-primary/10 bg-surface/80 px-6 text-left shadow-[inset_0_1px_0_rgba(244,247,251,0.08)] transition duration-300 hover:-translate-y-1 hover:border-accent/45 hover:bg-surface hover:shadow-[0_20px_60px_rgba(62,110,168,0.16)]",
        open && "border-accent/50 bg-surface shadow-[0_24px_70px_rgba(62,110,168,0.18)]"
      )}
    >
      <span>
        <span className="block text-sm font-black uppercase tracking-[0.08em] text-graphite/70">{title}</span>
        <span className="mt-2 block text-xl font-black text-primary">{value}</span>
      </span>
      <span className={cn("text-4xl leading-none transition duration-300", open ? "rotate-180" : "group-hover:translate-y-0.5")}>⌄</span>
    </button>
  );
}

function PriceFrame({
  summary,
  price,
  calculations
}: {
  summary: string;
  price: number;
  calculations: {
    outerChange: number;
    innerChange: number;
    trackChange: number;
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-surface/80 p-6 shadow-[0_24px_72px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-7"
    >
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
      <motion.div
        aria-hidden="true"
        animate={{ x: ["-18%", "18%", "-18%"], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-8 h-32 w-72 rounded-full bg-accent/18 blur-3xl"
      />

      <div className="relative grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Итоговая конфигурация</p>
            <motion.p
              key={summary}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
              className="mt-3 inline-flex rounded-full border border-primary/10 bg-background/60 px-5 py-3 text-sm font-bold text-primary"
            >
              {summary}
            </motion.p>
          </div>
          <Link
            href="/contact"
            className="metal-sheen inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-black text-white shadow-[0_16px_44px_rgba(62,110,168,0.28)] hover:-translate-y-0.5 hover:bg-[#4F82BD] sm:w-auto"
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
          <p className="text-[clamp(3rem,6vw,4.5rem)] font-black leading-none tracking-[-0.06em] text-primary">
            {formatRub(price)}
          </p>
          <p className="mt-4 text-xl font-black text-primary/90">{formatRub(price / 4)} за один диск</p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Наружу" value={`${calculations.outerChange > 0 ? "+" : ""}${calculations.outerChange.toFixed(1)} мм`} />
          <Metric label="Внутрь" value={`${calculations.innerChange > 0 ? "+" : ""}${calculations.innerChange.toFixed(1)} мм`} />
          <Metric label="Колея" value={`${calculations.trackChange > 0 ? "+" : ""}${calculations.trackChange.toFixed(1)} мм`} />
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-5 text-center backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-graphite">{label}</p>
      <p className="mt-2 text-2xl font-black text-primary">{value}</p>
    </div>
  );
}

export function WheelCalculator() {
  const [wheelType, setWheelType] = useState<WheelType>("Моноблоки");
  const [diameter, setDiameter] = useState(20);
  const [width, setWidth] = useState(11.0);
  const [et, setEt] = useState(20);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

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

  return (
    <section className="bg-background text-primary">
      <section className="relative isolate border-b border-primary/10 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
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

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="pt-2"
          >
            <p className="text-sm font-black uppercase tracking-[0.16em] text-accent">PRIDE calculator</p>
            <h1 className="mt-4 max-w-xl text-[clamp(2.625rem,6vw,5.25rem)] font-black leading-[0.96] tracking-[-0.04em]">
              Калькулятор параметров
            </h1>
            <p className="mt-5 max-w-md text-base font-semibold leading-7 text-graphite sm:text-lg">
              Настройте тип, диаметр, ширину и вылет в формате конфигуратора. Стоимость и посадка обновятся сразу.
            </p>
          </motion.div>

          <PriceFrame summary={summary} price={price} calculations={calculations} />
        </div>
      </section>

      <section className="bg-secondary/55 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3 lg:items-start">
          <div>
            <SelectorCard title="Тип дисков" value={wheelType} open={activePicker === "type"} onClick={() => setActivePicker(activePicker === "type" ? null : "type")} />
            <SelectorPanel active={activePicker === "type"}>
              <TypePicker value={wheelType} onChange={setWheelType} />
            </SelectorPanel>
          </div>
          <div>
            <SelectorCard title="Диаметр" value={`${diameter}"`} open={activePicker === "diameter"} onClick={() => setActivePicker(activePicker === "diameter" ? null : "diameter")} />
            <SelectorPanel active={activePicker === "diameter"}>
              <PickerRail label="Диаметр дисков" value={diameter} options={diameterOptions} format={(value) => `${value}`} onChange={setDiameter} />
            </SelectorPanel>
          </div>
          <div>
            <SelectorCard title="Ширина и вылет" value={`${formatWidth(width)} ET${et}`} open={activePicker === "fitment"} onClick={() => setActivePicker(activePicker === "fitment" ? null : "fitment")} />
            <SelectorPanel active={activePicker === "fitment"}>
              <div className="grid gap-8">
                <PickerRail label="Ширина дисков" value={width} options={widthOptions} format={(value) => value.toFixed(1)} onChange={setWidth} />
                <PickerRail label="Вылет дисков (ET)" value={et} options={etOptions} format={(value) => `${value}`} onChange={setEt} />
              </div>
            </SelectorPanel>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Выступ наружу" value={`${calculations.outerChange > 0 ? "+" : ""}${calculations.outerChange.toFixed(1)} мм`} />
          <Metric label="Уход внутрь" value={`${calculations.innerChange > 0 ? "+" : ""}${calculations.innerChange.toFixed(1)} мм`} />
          <Metric label="Изменение колеи" value={`${calculations.trackChange > 0 ? "+" : ""}${calculations.trackChange.toFixed(1)} мм`} />
          <Metric label="Ширина" value={`${calculations.widthDifference > 0 ? "+" : ""}${calculations.widthDifference.toFixed(1)} мм`} />
          <Metric label="Диаметр" value={`${calculations.diameterDifference > 0 ? "+" : ""}${calculations.diameterDifference.toFixed(1)}"`} />
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 rounded-[1.7rem] border border-primary/10 bg-surface/70 p-6 text-graphite backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-7">
            Расчет предварительный. Финальные параметры зависят от тормозной системы, подвески и желаемой посадки.
          </p>
          <Button asChild>
            <Link href="/fitment">Подобрать по автомобилю</Link>
          </Button>
        </div>
      </section>
    </section>
  );
}
