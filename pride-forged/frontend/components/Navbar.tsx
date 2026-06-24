"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CallbackModal } from "@/components/modal-callback";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  ["Каталог", "/catalog"],
  ["Подбор", "/fitment"],
  ["О бренде", "/about"],
  ["Контакты", "/contact"]
];

const mobileLinks = [["Главная", "/"], ...links];

const menuItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/contact") return pathname === "/contact" || pathname === "/contacts";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type HeaderLogoProps = {
  className?: string;
  onClick?: () => void;
  priority?: boolean;
};

function HeaderLogo({ className, onClick, priority = false }: HeaderLogoProps) {
  return (
    <Link
      href="/"
      aria-label="PRIDE Forged — на главную"
      className={cn("header-brand-logo block shrink-0", className)}
      onClick={onClick}
    >
      <Image
        src="/images/logo/pride-logo-light-theme.png"
        alt=""
        width={783}
        height={185}
        priority={priority}
        className="header-brand-logo-image header-brand-logo-light"
      />
      <Image
        src="/images/logo/pride-logo-dark-theme.png"
        alt=""
        width={783}
        height={185}
        priority={priority}
        className="header-brand-logo-image header-brand-logo-dark"
      />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackSource, setCallbackSource] = useState("header-callback");
  const closeCallbackModal = useCallback(() => setIsCallbackOpen(false), []);
  const openCallbackModal = useCallback((source = "header-callback") => {
    setCallbackSource(source);
    setIsCallbackOpen(true);
  }, []);

  const openMobileCallbackModal = useCallback(() => {
    setIsOpen(false);
    openCallbackModal("mobile_menu_call_request");
  }, [openCallbackModal]);

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
    <header className="sticky top-0 z-50 border-b border-[var(--header-border)] bg-[var(--header-bg)] shadow-[0_16px_50px_rgba(0,0,0,0.14)] backdrop-blur-[18px]">
      <div className="mx-auto grid h-[72px] w-full max-w-[1520px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-12 2xl:px-14">
        <nav className="hidden min-w-0 justify-self-start items-center gap-7 2xl:gap-8 lg:flex" aria-label="Основная навигация">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "whitespace-nowrap text-sm font-semibold text-graphite underline-offset-8 transition hover:text-accent hover:underline xl:text-[15px]",
                isActivePath(pathname, href) && "text-accent"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center justify-self-start rounded-full border border-primary/12 bg-surface/65 text-primary shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-accent/45 hover:bg-surface lg:hidden"
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

        <HeaderLogo
          priority
          className="w-[132px] min-w-0 justify-self-center sm:w-[150px] lg:w-[168px] xl:w-[180px]"
        />

        <div className="hidden min-w-0 justify-self-end items-center justify-end gap-3 lg:flex 2xl:gap-3.5">
          <a
            href="tel:+79257190338"
            className="hidden h-10 shrink-0 items-center justify-center rounded-full border border-primary/12 bg-primary/[0.06] px-4 text-sm font-semibold text-primary shadow-[inset_0_1px_0_rgb(var(--surface-rgb)/0.22)] backdrop-blur-xl transition hover:border-accent/45 hover:bg-accent/10 hover:text-accent xl:inline-flex"
          >
            +7 925 719-03-38
          </a>
          <Button type="button" size="default" className="h-10 px-4 xl:px-5" onClick={() => openCallbackModal()}>
            Заказать звонок
          </Button>
          <ThemeSwitcher variant="icon" />
        </div>

        <a
          href="tel:+79257190338"
          aria-label="Позвонить +7 925 719-03-38"
          className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-primary/12 bg-surface/65 text-primary shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:border-accent/45 hover:bg-surface hover:text-accent lg:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
          </svg>
        </a>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="mobile-menu-overlay fixed inset-0 z-[80] bg-[var(--menu-overlay)] backdrop-blur-[18px] lg:hidden"
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
              className="mobile-menu-panel relative z-[90] mx-4 my-4 flex max-h-[calc(100dvh-32px)] w-[calc(100%_-_32px)] max-w-xl flex-col overflow-y-auto rounded-[28px] border border-[var(--menu-border)] bg-[var(--menu-bg)] px-6 pb-[calc(24px_+_env(safe-area-inset-bottom))] pt-[calc(24px_+_env(safe-area-inset-top))] text-[var(--menu-text)] shadow-[var(--menu-shadow)] backdrop-blur-2xl sm:px-7 md:mx-auto md:max-w-2xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-4">
                <HeaderLogo className="w-[138px] min-w-0 sm:w-[156px]" onClick={() => setIsOpen(false)} />
                <button
                  type="button"
                  aria-label="Закрыть меню"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--menu-border)] bg-[rgb(var(--surface-rgb)/0.32)] text-[var(--menu-text)] shadow-[0_14px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:border-accent/55 hover:bg-[rgb(var(--accent-rgb)/0.12)] sm:h-14 sm:w-14"
                >
                  <span className="relative h-6 w-6">
                    <span className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                  </span>
                </button>
              </div>

              <div className="mt-6 h-px shrink-0 bg-gradient-to-r from-transparent via-[var(--menu-border)] to-transparent" />

              <motion.nav
                className="mt-5 grid shrink-0 gap-1"
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
                {mobileLinks.map(([label, href]) => (
                  <motion.div key={href} variants={menuItemVariants}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "group flex border-b border-[var(--menu-divider)] py-[15px] text-[28px] font-semibold leading-[1.18] text-[var(--menu-text)] transition hover:bg-[rgb(var(--accent-rgb)/0.08)] active:bg-[rgb(var(--accent-rgb)/0.12)]",
                        "rounded-2xl px-1 text-[clamp(1.75rem,7.4vw,2.35rem)] font-extrabold leading-[1.05] tracking-[-0.04em]",
                        isActivePath(pathname, href)
                          ? "border-transparent bg-[rgb(var(--accent-rgb)/0.10)] pl-4 text-accent shadow-[inset_3px_0_0_var(--accent)]"
                          : "hover:pl-3"
                      )}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={menuItemVariants} className="pt-6">
                  <button
                    type="button"
                    onClick={openMobileCallbackModal}
                    className="mobile-menu-call-button flex min-h-[62px] w-full items-center justify-center rounded-full border border-accent/45 bg-accent px-6 text-center text-lg font-extrabold text-white shadow-[0_18px_44px_rgb(var(--accent-rgb)/0.30)] transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_22px_54px_rgb(var(--accent-rgb)/0.36)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--menu-bg)] sm:min-h-[66px] sm:text-xl"
                  >
                    Заказать звонок
                  </button>
                </motion.div>
              </motion.nav>

              <div className="mt-6 flex justify-end">
                <ThemeSwitcher
                  variant="icon"
                  className="h-14 w-14 border-[var(--menu-border)] bg-[rgb(var(--surface-rgb)/0.30)] text-[var(--menu-text)] shadow-[0_14px_36px_rgba(0,0,0,0.16)]"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <CallbackModal isOpen={isCallbackOpen} onClose={closeCallbackModal} source={callbackSource} />
    </header>
  );
}
