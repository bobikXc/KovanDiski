import Link from "next/link";

const footerLinks = [
  ["Каталог", "/catalog"],
  ["Подбор по автомобилю", "/cars"],
  ["О компании", "/about"],
  ["Контакты", "/contact"]
];

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.32em] text-primary">PRIDE Forged</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-graphite/60">
            Премиальные кованые диски, созданные под характер автомобиля, точный fitment и стиль владельца.
          </p>
        </div>
        <nav className="grid gap-3 text-sm text-graphite/70">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-accent">
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-sm leading-7 text-graphite/70">
          <p className="font-semibold text-primary">PRIDE concierge</p>
          <p className="mt-2">Москва, премиальный шоурум PRIDE Forged</p>
          <p>+7 (495) 000-00-00</p>
          <p>sales@pride-forged.ru</p>
        </div>
      </div>
      <div className="border-t border-primary/10 px-4 py-5 text-center text-xs uppercase tracking-[0.24em] text-graphite/40">
        © 2026 PRIDE Forged. Bespoke forged wheels.
      </div>
    </footer>
  );
}
