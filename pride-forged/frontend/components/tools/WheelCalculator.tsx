"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PointerEvent as ReactPointerEvent, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WheelType = "monoblock" | "forged_multi_piece";

const diameterValues = [17, 18, 19, 20, 21, 22, 23, 24];
const widthValues = Array.from({ length: 13 }, (_, index) => 7 + index * 0.5);
const etValues = Array.from({ length: 41 }, (_, index) => 10 + index);
const BASE_PRICES: Record<WheelType, number> = {
  monoblock: 135_000,
  forged_multi_piece: 190_000
};
const STAGGERED_MODIFIER = 15_000;
const diameterModifiers: Record<number, number> = {
  17: 0,
  18: 5_000,
  19: 10_000,
  20: 15_000,
  21: 25_000,
  22: 35_000,
  23: 50_000,
  24: 65_000
};
const rubFormatter = new Intl.NumberFormat("ru-RU");

function formatRub(value: number) {
  return `${rubFormatter.format(value)} ₽`;
}

function formatWidth(value: number) {
  return value.toFixed(1);
}

type WheelValuePickerProps = {
  label: string;
  value: number;
  values: number[];
  onChange: (value: number) => void;
  format?: (value: number) => string;
};

function WheelValuePicker({ label, value, values, onChange, format = String }: WheelValuePickerProps) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const index = values.indexOf(value);
  const previous = values[index - 1];
  const next = values[index + 1];

  function step(direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex >= 0 && nextIndex < values.length) onChange(values[nextIndex]);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) <= 30 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    step(deltaX < 0 ? 1 : -1);
  }

  return (
    <div
      className="touch-pan-y select-none rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-3.5 sm:p-4"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      <p className="text-center text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-graphite">{label}</p>
      <div className="mt-3 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-1.5">
        <button
          type="button"
          disabled={index <= 0}
          onClick={() => step(-1)}
          aria-label={`Уменьшить: ${label}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xl text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-25"
        >
          ‹
        </button>
        <div className="grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-1.5 text-center">
          <span className="truncate text-xs font-bold tabular-nums text-graphite/50">{previous === undefined ? "—" : format(previous)}</span>
          <motion.span
            key={value}
            initial={{ opacity: 0.55, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="min-w-[3.75rem] text-2xl font-black tabular-nums text-primary sm:text-[1.75rem]"
          >
            {format(value)}
          </motion.span>
          <span className="truncate text-xs font-bold tabular-nums text-graphite/50">{next === undefined ? "—" : format(next)}</span>
        </div>
        <button
          type="button"
          disabled={index >= values.length - 1}
          onClick={() => step(1)}
          aria-label={`Увеличить: ${label}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xl text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-25"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] py-2.5 last:border-0">
      <span className="text-xs text-graphite sm:text-sm">{label}</span>
      <span className="text-right text-sm font-black text-primary">{value}</span>
    </div>
  );
}

type AxisPickerGroupProps = {
  title?: string;
  width: number;
  et: number;
  onWidthChange: (value: number) => void;
  onEtChange: (value: number) => void;
};

function AxisPickerGroup({ title, width, et, onWidthChange, onEtChange }: AxisPickerGroupProps) {
  return (
    <div className={cn(
      "grid gap-2.5",
      title ? "rounded-[20px] border border-[var(--border)] bg-[var(--surface-2)] p-3.5 shadow-[inset_0_1px_0_rgb(var(--text-primary-rgb)/0.05)] sm:p-4" : "sm:grid-cols-2"
    )}>
      {title ? (
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-primary">{title}</h3>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" />
        </div>
      ) : null}
      <WheelValuePicker label="Ширина дисков (J)" value={width} values={widthValues} onChange={onWidthChange} format={formatWidth} />
      <WheelValuePicker label="Вылет дисков (ET)" value={et} values={etValues} onChange={onEtChange} />
    </div>
  );
}

export function WheelCalculator() {
  const [wheelType, setWheelType] = useState<WheelType>("monoblock");
  const [diameter, setDiameter] = useState(20);
  const [width, setWidth] = useState(9);
  const [et, setEt] = useState(25);
  const [isStaggered, setIsStaggered] = useState(false);
  const [frontWidth, setFrontWidth] = useState(9);
  const [frontEt, setFrontEt] = useState(25);
  const [rearWidth, setRearWidth] = useState(10);
  const [rearEt, setRearEt] = useState(25);

  const typeLabel = wheelType === "monoblock" ? "Моноблок" : "Составные";
  const estimatedPrice = useMemo(() => {
    const largestWidth = isStaggered ? Math.max(frontWidth, rearWidth) : width;
    const hasComplexEt = isStaggered ? frontEt < 20 || frontEt > 40 || rearEt < 20 || rearEt > 40 : et < 20 || et > 40;
    const widthModifier = largestWidth >= 12.5 ? 30_000 : largestWidth >= 11.5 ? 20_000 : largestWidth >= 10.5 ? 10_000 : 0;
    const etComplexityModifier = hasComplexEt ? 10_000 : 0;
    const staggeredModifier = isStaggered ? STAGGERED_MODIFIER : 0;

    return BASE_PRICES[wheelType] + diameterModifiers[diameter] + widthModifier + etComplexityModifier + staggeredModifier;
  }, [diameter, et, frontEt, frontWidth, isStaggered, rearEt, rearWidth, wheelType, width]);
  const estimatedPriceLabel = `от ${formatRub(estimatedPrice)}`;
  const contactQuery = {
    source: "calculator",
    calculator_type: typeLabel,
    calculator_diameter: `${diameter}"`,
    calculator_is_staggered: isStaggered ? "true" : "false",
    ...(isStaggered ? {
      calculator_front_width: formatWidth(frontWidth),
      calculator_front_et: String(frontEt),
      calculator_rear_width: formatWidth(rearWidth),
      calculator_rear_et: String(rearEt)
    } : {
      calculator_width: formatWidth(width),
      calculator_et: String(et)
    }),
    calculator_estimated_price: estimatedPriceLabel
  };

  return (
    <main className="bg-background text-primary">
      <section className="calculator-section calculator-hero relative z-10 border-b border-primary/10 px-5 pb-10 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-24">
        <div className="relative mx-auto max-w-[1440px]">
          <div className="max-w-[720px]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent sm:text-sm">PRIDE CALCULATOR</p>
            <h1 className="mt-3 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.98] tracking-[-0.04em]">Калькулятор параметров</h1>
            <p className="mt-4 max-w-[680px] text-sm font-semibold leading-[1.55] text-graphite sm:text-base lg:text-lg">
              Настройте тип дисков, диаметр, ширину и вылет. Мы рассчитаем предварительную конфигурацию, а финальную стоимость уточним после заявки.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-[1320px] items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(290px,0.62fr)] lg:gap-5">
          <div className="min-w-0 space-y-3">
            <div className="liquid-card rounded-[22px] p-4 sm:p-5">
              <h2 className="text-lg font-black sm:text-xl">Тип дисков</h2>
              <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-1">
                {([
                  ["monoblock", "Моноблок"],
                  ["forged_multi_piece", "Составные"]
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setWheelType(value)}
                    aria-pressed={wheelType === value}
                    className={cn(
                      "min-h-10 rounded-[14px] px-2 text-sm font-extrabold transition",
                      wheelType === value ? "bg-accent text-white shadow-[0_10px_24px_rgb(var(--accent-rgb)/0.28)]" : "text-graphite hover:bg-[var(--surface)] hover:text-primary"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="liquid-card rounded-[22px] p-4 sm:p-5">
              <h2 className="text-lg font-black sm:text-xl">Диаметр</h2>
              <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                {diameterValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDiameter(value)}
                    aria-pressed={diameter === value}
                    className={cn(
                      "h-11 rounded-[14px] border text-sm font-black transition",
                      diameter === value ? "border-accent bg-accent text-white" : "border-[var(--border)] bg-[var(--surface-2)] text-graphite hover:border-accent/50 hover:text-primary"
                    )}
                  >
                    {value}&quot;
                  </button>
                ))}
              </div>
            </div>

            <div className="liquid-card rounded-[22px] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-black sm:text-xl">Ширина и вылет</h2>
                <button
                  type="button"
                  onClick={() => setIsStaggered((value) => !value)}
                  aria-pressed={isStaggered}
                  className={cn(
                    "inline-flex w-full items-center justify-between gap-3 rounded-full border px-3 py-2 text-xs font-extrabold uppercase tracking-[0.1em] transition sm:w-auto",
                    isStaggered
                      ? "border-accent/55 bg-accent/15 text-primary shadow-[0_0_0_4px_rgb(var(--accent-rgb)/0.08)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-graphite hover:border-accent/45 hover:text-primary"
                  )}
                >
                  <span>Разноширокие</span>
                  <span
                    className={cn(
                      "relative h-6 w-11 rounded-full border transition",
                      isStaggered ? "border-accent bg-accent" : "border-[var(--border)] bg-[var(--surface)]"
                    )}
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-[0_4px_12px_rgb(0_0_0/0.25)] transition",
                        isStaggered ? "left-[22px]" : "left-1"
                      )}
                    />
                  </span>
                </button>
              </div>
              {isStaggered ? (
                <div className="mt-3 grid gap-3 xl:grid-cols-2">
                  <AxisPickerGroup title="Передняя ось" width={frontWidth} et={frontEt} onWidthChange={setFrontWidth} onEtChange={setFrontEt} />
                  <AxisPickerGroup title="Задняя ось" width={rearWidth} et={rearEt} onWidthChange={setRearWidth} onEtChange={setRearEt} />
                </div>
              ) : (
                <div className="mt-3">
                  <AxisPickerGroup width={width} et={et} onWidthChange={setWidth} onEtChange={setEt} />
                </div>
              )}
            </div>
          </div>

          <aside className="liquid-card rounded-[24px] p-4 sm:p-5 lg:sticky lg:top-24">
            <h2 className="text-xl font-black sm:text-2xl">Итоговая конфигурация</h2>
            <div className="mt-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] px-3.5">
              <SummaryRow label="Тип" value={typeLabel} />
              <SummaryRow label="Диаметр" value={`${diameter}\"`} />
              {isStaggered ? (
                <>
                  <SummaryRow label="Посадка" value="Разноширокая" />
                  <SummaryRow label="Передняя ось" value={`${formatWidth(frontWidth)}J ET${frontEt}`} />
                  <SummaryRow label="Задняя ось" value={`${formatWidth(rearWidth)}J ET${rearEt}`} />
                </>
              ) : (
                <>
                  <SummaryRow label="Ширина" value={`${formatWidth(width)}J`} />
                  <SummaryRow label="Вылет" value={`ET${et}`} />
                </>
              )}
            </div>

            <div className="mt-3 rounded-[18px] border border-accent/30 bg-accent/10 p-4">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-graphite">Примерная стоимость</p>
              <p className="mt-1.5 text-2xl font-black tracking-[-0.03em] text-primary sm:text-[1.9rem]">{estimatedPriceLabel}</p>
            </div>
            <p className="mt-3 text-xs leading-5 text-graphite sm:text-sm">
              Ориентировочная стоимость. Финальную цену рассчитаем после проверки параметров автомобиля и пожеланий по отделке.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href={{ pathname: "/contact", query: contactQuery }}>Оставить заявку</Link>
            </Button>
          </aside>
        </div>
      </section>
    </main>
  );
}
