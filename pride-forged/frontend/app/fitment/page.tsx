import type { Metadata } from "next";

import { FitmentConfigurator } from "@/components/fitment/FitmentConfigurator";

export const metadata: Metadata = {
  title: "Подбор дисков - PRIDE Forged",
  description: "Selection hub PRIDE Forged: подбор кованых дисков по автомобилю или по модели диска.",
  openGraph: {
    title: "Подбор дисков - PRIDE Forged",
    description: "Выберите автомобиль или модель диска и получите предварительные рекомендации PRIDE.",
    type: "website",
    url: "/fitment"
  }
};

export default function FitmentPage() {
  return <FitmentConfigurator />;
}
