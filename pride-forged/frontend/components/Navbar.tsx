import Link from "next/link";

import { Button } from "@/components/ui/button";

const links = [
  ["Каталог", "/catalog"],
  ["Подбор", "/cars"],
  ["О компании", "/about"],
  ["Контакты", "/contact"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary/72 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black uppercase tracking-[0.32em] text-white transition hover:text-accent">
          PRIDE
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-white/72 transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <Button asChild size="default" className="hidden md:inline-flex">
          <Link href="/contact">Заказать звонок</Link>
        </Button>
        <Link href="/catalog" className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-accent hover:text-accent md:hidden">
          Каталог
        </Link>
      </div>
    </header>
  );
}
