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

const menuItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
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
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/12 bg-surface/65 text-primary shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-accent/45 hover:bg-surface lg:hidden"
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
            className="fixed inset-0 z-[80] bg-[var(--menu-overlay)] backdrop-blur-[18px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Мобильное меню"
              className="relative z-[90] mx-4 my-4 flex max-h-[calc(100dvh-32px)] w-[calc(100%_-_32px)] max-w-xl flex-col overflow-y-auto rounded-[28px] border border-[var(--menu-border)] bg-[var(--menu-bg)] px-7 pb-[calc(24px_+_env(safe-area-inset-bottom))] pt-[calc(28px_+_env(safe-area-inset-top))] text-[var(--menu-text)] shadow-[var(--menu-shadow)] backdrop-blur-2xl md:mx-auto md:max-w-2xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-4">
                <div onClick={() => setIsOpen(false)}>
                  <BrandLogo
                    imageClassName="h-8"
                    className="min-w-0"
                    textClassName="text-[var(--menu-text)]"
                    subTextClassName="text-accent"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Закрыть меню"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--menu-border)] bg-[rgb(var(--surface-rgb)/0.22)] text-[var(--menu-text)] shadow-[0_14px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:border-accent/55 hover:bg-[rgb(var(--accent-rgb)/0.12)]"
                >
                  <span className="relative h-6 w-6">
                    <span className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                  </span>
                </button>
              </div>

              <div className="mt-6 h-px shrink-0 bg-gradient-to-r from-transparent via-[var(--menu-border)] to-transparent" />

              <motion.nav
                className="mt-4 grid shrink-0"
                aria-label="Основная навигация"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.045,
                      delayChildren: 0.06
                    }
                  }
                }}
              >
                {links.map(([label, href]) => (
                  <motion.div key={href} variants={menuItemVariants}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "group flex border-b border-[var(--menu-divider)] py-[15px] text-[28px] font-semibold leading-[1.18] text-[var(--menu-text)] transition hover:bg-[rgb(var(--accent-rgb)/0.08)] active:bg-[rgb(var(--accent-rgb)/0.12)]",
                        pathname === href && "pl-3 text-accent shadow-[inset_2px_0_0_var(--accent)]"
                      )}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <div className="mt-6">
                <div className="rounded-full border border-[var(--menu-border)] bg-[rgb(var(--surface-rgb)/0.22)] p-1 shadow-[inset_0_1px_0_rgb(var(--surface-rgb)/0.18)]">
                  <ThemeSwitcher className="h-11 w-full border-0 bg-transparent p-0 text-[14px] shadow-none [&_button]:h-9 [&_button]:rounded-full [&_button]:text-sm [&_button]:font-semibold [&_button[aria-pressed='true']]:bg-accent [&_button[aria-pressed='true']]:text-white [&_button:not([aria-pressed='true'])]:bg-transparent [&_button:not([aria-pressed='true'])]:text-[var(--menu-muted)] [&_button:not([aria-pressed='true'])]:hover:bg-[rgb(var(--accent-rgb)/0.08)] [&_button:not([aria-pressed='true'])]:hover:text-[var(--menu-text)]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
