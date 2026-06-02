"use client";

import { ErrorState } from "@/components/common/ErrorState";

export default function VehiclesError({ reset }: { reset: () => void }) {
  return <ErrorState reset={reset} title="Каталог автомобилей недоступен" />;
}
