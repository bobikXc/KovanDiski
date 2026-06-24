"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { ContactMethodPicker, type PreferredContactMethod } from "@/components/contact-method-picker";
import { submitContact } from "@/lib/api";

type CallbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const fieldClassName =
  "h-[52px] w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-base text-primary outline-none transition placeholder:text-graphite/65 focus:border-accent focus:ring-4 focus:ring-accent/10";

export function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>("call");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => nameInputRef.current?.focus(), 80);

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]'
      )
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const phone = String(values.get("phone") ?? "").trim();
    const preferredTime = String(values.get("preferred_time") ?? "").trim();
    const comment = String(values.get("comment") ?? "").trim();
    const hasConsent = values.get("personal_data_consent") === "on";

    setStatus("idle");
    setValidationError("");

    if (!name || !phone) {
      setValidationError("Заполните имя и телефон.");
      return;
    }
    if (!hasConsent) {
      setValidationError("Для отправки заявки необходимо согласие на обработку персональных данных.");
      return;
    }

    const formData = new FormData();
    formData.append("source", "header-callback");
    formData.append("request_type", "callback");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("preferred_time", preferredTime);
    formData.append("comment", comment);
    formData.append("personal_data_consent", "true");
    formData.append("policy_accepted", "true");
    formData.append("preferred_contact_method", preferredContactMethod);
    formData.append("preferred_contact", preferredContactMethod);

    setIsSubmitting(true);
    try {
      await submitContact(formData);
      form.reset();
      setPreferredContactMethod("call");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-md sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="callback-modal-title"
            aria-describedby="callback-modal-description"
            className="relative my-auto max-h-[calc(100dvh-24px)] w-full max-w-[520px] overflow-y-auto rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-[22px] text-primary shadow-[var(--shadow-premium)] backdrop-blur-2xl sm:max-h-[calc(100dvh-32px)] sm:rounded-[32px] sm:p-8"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={handleDialogKeyDown}
          >
            <button
              type="button"
              aria-label="Закрыть окно"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-primary transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-5 sm:top-5"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>

            <div className="pr-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">PRIDE Forged</p>
              <h2 id="callback-modal-title" className="mt-3 text-3xl font-black leading-tight sm:text-[2rem]">
                Заказать звонок
              </h2>
              <p id="callback-modal-description" className="mt-3 text-sm leading-6 text-graphite sm:text-base">
                Оставьте номер — специалист PRIDE уточнит детали и подскажет следующий шаг.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="callback-name" className="mb-1.5 block text-sm font-semibold">Имя</label>
                <input ref={nameInputRef} id="callback-name" name="name" required maxLength={60} placeholder="Ваше имя" autoComplete="name" className={fieldClassName} />
              </div>
              <div>
                <label htmlFor="callback-phone" className="mb-1.5 block text-sm font-semibold">Телефон</label>
                <input id="callback-phone" name="phone" type="tel" required maxLength={30} placeholder="+7 999 000-00-00" autoComplete="tel" className={fieldClassName} />
              </div>
              <div>
                <label htmlFor="callback-time" className="mb-1.5 block text-sm font-semibold">Удобное время для звонка</label>
                <input id="callback-time" name="preferred_time" maxLength={80} placeholder="Например: сегодня после 18:00" className={fieldClassName} />
              </div>
              <div>
                <label htmlFor="callback-comment" className="mb-1.5 block text-sm font-semibold">Комментарий</label>
                <textarea id="callback-comment" name="comment" maxLength={300} placeholder="Кратко опишите вопрос" className={`${fieldClassName} !h-24 resize-y py-3`} />
              </div>

              <ContactMethodPicker value={preferredContactMethod} onChange={setPreferredContactMethod} />

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-graphite">
                <input name="personal_data_consent" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-[var(--border)] bg-[var(--surface-2)] accent-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" />
                <span>
                  Я согласен на обработку персональных данных и ознакомлен с{" "}
                  <Link href="/privacy" onClick={onClose} className="font-semibold text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-accent">
                    политикой конфиденциальности
                  </Link>.
                </span>
              </label>

              {validationError ? <p role="alert" className="text-sm font-semibold text-red-500">{validationError}</p> : null}
              {status === "success" ? <p role="status" className="text-sm font-semibold text-primary">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p> : null}
              {status === "error" ? <p role="alert" className="text-sm font-semibold text-red-500">Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.</p> : null}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Отправляем..." : "Заказать звонок"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
