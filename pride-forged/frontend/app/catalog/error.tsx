"use client";

import { ErrorState } from "@/components/common/ErrorState";

export default function CatalogError({ reset }: { reset: () => void }) {
  return <ErrorState reset={reset} title="Каталог дисков недоступен" />;
}
