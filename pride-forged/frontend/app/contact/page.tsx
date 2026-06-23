"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ContactMethodPicker, type PreferredContactMethod } from "@/components/contact-method-picker";
import { submitContact } from "@/lib/api";

type ContactForm = { name: string; phone: string; car: string; comment: string };

const MAX_FILES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const SUCCESS_MESSAGE = "Заявка отправлена. Мы свяжемся с вами в ближайшее время.";
const ERROR_MESSAGE = "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.";
const CONSENT_ERROR_MESSAGE = "Для отправки заявки необходимо согласие на обработку персональных данных.";

const contactItems = [
  { label: "Адрес", value: "Москва, премиальный шоурум PRIDE Forged" },
  { label: "Телефон", value: "+7 925 719-03-38", href: "tel:+79257190338" },
  { label: "Email", value: "sales@pride-forged.ru", href: "mailto:sales@pride-forged.ru" }
];

export default function ContactPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>("call");
  const [consentTouched, setConsentTouched] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>();

  function clearFiles() {
    setFiles([]);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    setSubmitStatus("idle");

    if (selected.length > MAX_FILES) {
      setFileError(`Можно прикрепить не более ${MAX_FILES} фотографий.`);
      event.target.value = "";
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileError(`Файл «${oversized.name}» превышает максимальный размер 8 МБ.`);
      event.target.value = "";
      return;
    }

    const unsupported = selected.find((file) => !ALLOWED_FILE_TYPES.has(file.type));
    if (unsupported) {
      setFileError(`Файл «${unsupported.name}» имеет неподдерживаемый формат.`);
      event.target.value = "";
      return;
    }

    setFiles(selected);
    setFileError(null);
  }

  async function onSubmit(values: ContactForm) {
    setSubmitStatus("idle");
    if (!consent) {
      setConsentTouched(true);
      return;
    }

    const formData = new FormData();
    const searchParams = new URLSearchParams(window.location.search);
    const isCalculatorRequest = searchParams.get("source") === "calculator";
    formData.append("name", values.name.trim());
    formData.append("phone", values.phone.trim());
    formData.append("car", values.car?.trim() ?? "");
    formData.append("comment", values.comment?.trim() ?? "");
    formData.append("source", isCalculatorRequest ? "calculator" : window.location.pathname || "contacts-page");
    formData.append("personal_data_consent", "true");
    formData.append("preferred_contact_method", preferredContactMethod);
    if (isCalculatorRequest) {
      [
        "calculator_type",
        "calculator_diameter",
        "calculator_is_staggered",
        "calculator_width",
        "calculator_et",
        "calculator_front_width",
        "calculator_front_et",
        "calculator_rear_width",
        "calculator_rear_et",
        "calculator_estimated_price"
      ].forEach((field) => {
        const value = searchParams.get(field);
        if (value) formData.append(field, value);
      });
    }
    files.forEach((file) => formData.append("files", file));

    try {
      await submitContact(formData);
      reset();
      clearFiles();
      setConsent(false);
      setPreferredContactMethod("call");
      setConsentTouched(false);
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <section className="contacts-page">
      <Image
        src="/images/contacts/contact-car.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="contacts-page-bg"
      />
      <div className="contacts-page-overlay" aria-hidden="true" />

      <div className="contacts-container">
        <div className="contacts-left">
          <div className="contacts-heading">
            <p className="contacts-label">КОНТАКТЫ</p>
            <h1>Обсудим ваш проект</h1>
            <p>
              Расскажите об автомобиле, желаемой посадке и стиле дисков. Мы проверим параметры, предложим дизайн и подскажем следующий шаг.
            </p>
          </div>

          <div className="contacts-info">
            {contactItems.map((item) => (
              <div key={item.label} className="contacts-info-item">
                <span>{item.label}</span>
                {item.href ? <a href={item.href}>{item.value}</a> : <p>{item.value}</p>}
              </div>
            ))}
          </div>

        </div>

        <div className="contacts-form-panel">
          <form onSubmit={handleSubmit(onSubmit)} className="contacts-form">
            <input
              {...register("name", {
                required: "Укажите ваше имя",
                validate: (value) => Boolean(value.trim()) || "Укажите ваше имя"
              })}
              aria-label="Ваше имя"
              aria-invalid={Boolean(errors.name)}
              placeholder="Ваше имя"
              maxLength={100}
            />
            {errors.name && <p className="contacts-field-error" role="alert">{errors.name.message}</p>}
            <input
              {...register("phone", {
                required: "Укажите телефон",
                validate: (value) => Boolean(value.trim()) || "Укажите телефон"
              })}
              aria-label="Телефон"
              aria-invalid={Boolean(errors.phone)}
              placeholder="Телефон"
              inputMode="tel"
              maxLength={50}
            />
            {errors.phone && <p className="contacts-field-error" role="alert">{errors.phone.message}</p>}
            <input {...register("car")} aria-label="Автомобиль" placeholder="Автомобиль" maxLength={150} />
            <textarea {...register("comment")} aria-label="Комментарий" placeholder="Комментарий" rows={4} maxLength={2000} />

            <ContactMethodPicker value={preferredContactMethod} onChange={setPreferredContactMethod} />

            <div className="contacts-files">
              <input
                ref={fileInputRef}
                type="file"
                id="contact-files"
                className="contacts-file-input"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={onFilesChange}
                disabled={isSubmitting}
              />
              <div className="contacts-files-actions">
                <label htmlFor="contact-files" className="contacts-file-button">Прикрепить фото</label>
                {files.length > 0 && (
                  <button type="button" className="contacts-files-clear" onClick={clearFiles} disabled={isSubmitting}>
                    Очистить
                  </button>
                )}
              </div>
              {files.length > 0 && (
                <ul className="contacts-files-list" aria-label="Выбранные фотографии">
                  {files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}</li>)}
                </ul>
              )}
              {fileError && <p className="contacts-field-error" role="alert">{fileError}</p>}
            </div>

            {submitStatus === "success" && <p className="contacts-form-status contacts-form-success" role="status">{SUCCESS_MESSAGE}</p>}
            {submitStatus === "error" && <p className="contacts-form-status contacts-form-error" role="alert">{ERROR_MESSAGE}</p>}

            <div className="contact-consent-group">
              <label className="contact-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    setConsentTouched(true);
                  }}
                  onBlur={() => setConsentTouched(true)}
                  aria-invalid={consentTouched && !consent}
                  aria-describedby={consentTouched && !consent ? "contact-consent-error" : undefined}
                />
                <span className="contact-consent-box" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false">
                    <path d="m3.25 8.2 3.05 3.05 6.45-6.5" />
                  </svg>
                </span>
                <span className="contact-consent-copy">
                  Я согласен на обработку персональных данных и ознакомлен с{" "}
                  <Link href="/privacy">политикой конфиденциальности</Link>.
                </span>
              </label>
              {consentTouched && !consent && (
                <p id="contact-consent-error" className="contact-consent-error" role="alert">
                  {CONSENT_ERROR_MESSAGE}
                </p>
              )}
            </div>

            <div
              className="contacts-submit-wrapper"
              onPointerDownCapture={() => {
                if (!consent) setConsentTouched(true);
              }}
            >
              <Button
                type="submit"
                size="lg"
                className="contacts-submit"
                disabled={isSubmitting || Boolean(fileError) || !consent}
              >
                {isSubmitting ? "Отправляем…" : "Отправить заявку"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
