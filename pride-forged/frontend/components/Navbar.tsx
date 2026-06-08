"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  ["Главная", "/"],
  ["Каталог", "/catalog"],
  ["Подбор", "/fitment"],
  ["О бренде", "/about"],
  ["Контакты", "/contact"]
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/[0.08] bg-background/78 shadow-[0_16px_50px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <BrandLogo priority imageClassName="h-8 sm:h-9" className="shrink-0" />
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition hover:text-primary",
                pathname === href ? "text-primary" : "text-graphite"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeSwitcher />
          <Button asChild size="default">
            <Link href="/contact">Заказать звонок</Link>
          </Button>
        </div>
        <button
          type="button"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="relative z-[70] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/12 bg-surface/65 text-primary shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-accent/45 hover:bg-surface lg:hidden"
        >
          <span className="sr-only">{isOpen ? "Закрыть меню" : "Открыть меню"}</span>
          <span className="relative h-4 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-300",
                isOpen && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-300",
                isOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition duration-300",
                isOpen && "-translate-y-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 top-[72px] z-[60] bg-background/86 px-4 pb-6 pt-4 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.nav
              className="mx-auto grid max-w-md gap-2 rounded-[1.5rem] border border-primary/12 bg-surface/88 p-2 shadow-[0_26px_80px_rgba(0,0,0,0.36)]"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-[1.1rem] px-4 py-3 text-base font-semibold transition hover:bg-accent/14",
                    pathname === href ? "bg-accent/18 text-primary" : "text-graphite"
                  )}
                >
                  {label}
                </Link>
              ))}
              <ThemeSwitcher className="mt-2" />
              <Button asChild size="lg" className="mt-2 w-full">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Заказать звонок
                </Link>
              </Button>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
