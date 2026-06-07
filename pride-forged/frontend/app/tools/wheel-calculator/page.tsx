import type { Metadata } from "next";

import { WheelCalculator } from "@/components/tools/WheelCalculator";

export const metadata: Metadata = {
  title: "Калькулятор параметров дисков — PRIDE Forged",
  description: "Расчёт изменения вылета, внутреннего положения, колеи, ширины и диаметра диска."
};

export default function WheelCalculatorPage() {
  return <WheelCalculator />;
}
