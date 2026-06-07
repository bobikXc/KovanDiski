import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

const links = [
  ["Главная", "/"],
  ["Каталог", "/catalog"],
  ["Подбор", "/fitment"],
  ["О бренде", "/about"],
  ["Контакты", "/contact"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/[0.08] bg-[#07111F]/72 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo priority imageClassName="h-8 sm:h-9" className="shrink-0" />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-graphite transition hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
        <Button asChild size="default" className="hidden md:inline-flex">
          <Link href="/contact">Заказать звонок</Link>
        </Button>
        <nav className="-mx-1 flex w-full gap-2 overflow-x-auto px-1 pb-1 md:hidden">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-primary/10 bg-surface/65 px-3 py-2 text-sm font-medium text-primary backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
