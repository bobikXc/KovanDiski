"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TELEGRAM_URL = "https://t.me/pride_forged";
const WHATSAPP_URL = "https://wa.me/79257190338";
// Заменить на реальную ссылку MAX, когда будет готова.
const MAX_URL: string = "";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow);
      if (!shouldShow) setIsContactOpen(false);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, scale: 0.86, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.86, y: 10 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence>
            {isContactOpen ? (
              <motion.div
                id="quick-contact-menu"
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_14px_42px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
                aria-label="Быстрые способы связи"
              >
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Открыть Telegram" onClick={() => setIsContactOpen(false)} className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[0.68rem] font-black tracking-[0.08em] text-primary transition hover:bg-accent hover:text-white">TG</a>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Открыть WhatsApp" onClick={() => setIsContactOpen(false)} className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[0.68rem] font-black tracking-[0.08em] text-primary transition hover:bg-accent hover:text-white">WA</a>
                {MAX_URL ? (
                  <a href={MAX_URL} target="_blank" rel="noreferrer" aria-label="Открыть MAX" onClick={() => setIsContactOpen(false)} className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[0.68rem] font-black tracking-[0.08em] text-primary transition hover:bg-accent hover:text-white">MAX</a>
                ) : (
                  <span title="Скоро" aria-disabled="true" className="inline-flex h-8 min-w-8 cursor-not-allowed items-center justify-center rounded-full px-2 text-[0.68rem] font-black tracking-[0.08em] text-graphite/40">MAX</span>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={isContactOpen ? "Закрыть способы связи" : "Выбрать способ связи"}
              aria-expanded={isContactOpen}
              aria-controls="quick-contact-menu"
              onClick={() => setIsContactOpen((value) => !value)}
              className="metal-sheen flex h-11 w-11 items-center justify-center rounded-full border border-accent/45 bg-accent/90 text-white shadow-[0_18px_52px_rgb(var(--accent-rgb)/0.32)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_22px_62px_rgb(var(--accent-rgb)/0.42)] sm:h-12 sm:w-12"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
              </svg>
            </button>
            <button
              aria-label="Вернуться наверх"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-surface/70 text-primary shadow-[0_18px_52px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface hover:shadow-[0_22px_64px_rgba(62,110,168,0.18)] sm:h-12 sm:w-12"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              type="button"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
