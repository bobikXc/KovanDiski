import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xl font-black tracking-[0.3em]">PRIDE</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
            Кованые диски, созданные под характер автомобиля и стиль владельца.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/70">
          <Link href="/catalog">Каталог</Link>
          <Link href="/cars">Подбор по автомобилю</Link>
          <Link href="/about">О компании</Link>
        </div>
        <div className="text-sm leading-7 text-white/70">
          <p>Москва, премиальный шоурум PRIDE Forged</p>
          <p>+7 (495) 000-00-00</p>
          <p>sales@pride-forged.ru</p>
        </div>
      </div>
    </footer>
  );
}
