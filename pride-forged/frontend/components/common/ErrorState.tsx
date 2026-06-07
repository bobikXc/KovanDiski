"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ErrorState({ reset, title = "Не удалось загрузить данные" }: { reset: () => void; title?: string }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Ошибка API</p>
        <h1 className="mt-4 text-3xl font-black sm:text-5xl">{title}</h1>
        <p className="mt-4 text-graphite">Проверьте доступность FastAPI backend и повторите загрузку.</p>
        <Button type="button" onClick={reset} className="mt-8">Повторить</Button>
      </Card>
    </section>
  );
}
