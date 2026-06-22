import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";

const footerLinks = [
  ["Каталог", "/catalog"],
  ["Подбор дисков", "/fitment"],
  ["Калькулятор", "/tools/wheel-calculator"],
  ["О компании", "/about"],
  ["Контакты", "/contact"]
];

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <BrandLogo imageClassName="h-12" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-graphite/60">
            Премиальные кованые диски, созданные под характер автомобиля, точный fitment и стиль владельца.
          </p>
        </div>
        <nav className="grid gap-3 text-sm text-graphite">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-accent">
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-sm leading-7 text-graphite">
          <p className="font-semibold text-primary">PRIDE concierge</p>
          <p className="mt-2">Москва, премиальный шоурум PRIDE Forged</p>
          <p>+7 (495) 000-00-00</p>
          <p>sales@pride-forged.ru</p>
        </div>
      </div>
      <div className="border-t border-primary/10 px-4 py-5 text-xs text-graphite/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="uppercase tracking-[0.24em]">© 2026 PRIDE Forged. Bespoke forged wheels.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Правовая информация">
            <Link href="/privacy" className="transition hover:text-accent">Политика конфиденциальности</Link>
            <Link href="/cookies" className="transition hover:text-accent">Политика cookie</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
