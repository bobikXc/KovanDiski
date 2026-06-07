export function LoadingState({ title = "Загружаем данные" }: { title?: string }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">PRIDE Forged</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">{title}</h1>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-[1.5rem] border border-primary/10 bg-surface/60" />
          ))}
        </div>
      </div>
    </section>
  );
}
