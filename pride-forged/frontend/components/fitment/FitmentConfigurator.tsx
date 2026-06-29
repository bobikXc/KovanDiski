"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ContactMethodPicker, type PreferredContactMethod } from "@/components/contact-method-picker";
import { LiquidCard } from "@/components/ui/liquid-card";
import { cn } from "@/lib/utils";
import { ApiRequestError, submitContact } from "@/lib/api";
import { appendLeadSecurityFields, createLeadFormStartedAt, LeadHoneypotFields } from "@/lib/lead-security";
import { reachGoal } from "@/lib/metrika";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const SUBMIT_ERROR = "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.";

function ManualField({
  label,
  value,
  placeholder,
  maxLength,
  required = false,
  multiline = false,
  error,
  onChange,
  onBlur
}: {
  label: string;
  value: string;
  placeholder: string;
  maxLength: number;
  required?: boolean;
  multiline?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const className = cn(
    "fitment-manual-control w-full min-w-0 rounded-2xl border bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--text-primary)] outline-none backdrop-blur-xl transition duration-300 placeholder:font-normal placeholder:text-[var(--text-secondary)]/60 focus:border-[var(--accent)] focus:ring-4 focus:ring-accent/15",
    multiline ? "h-28 resize-none py-3.5 leading-6" : "h-12",
    error ? "border-red-400/70" : "border-[var(--border)]"
  );

  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
        <span>{label}{required ? " *" : ""}</span>
        <span className="text-[0.65rem] font-medium normal-case tracking-normal opacity-60">{value.length}/{maxLength}</span>
      </span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={className}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={className}
        />
      )}
      {error ? <span className="mt-2 block text-xs font-medium text-red-400">{error}</span> : null}
    </label>
  );
}

export function FitmentConfigurator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formStartedAtRef = useRef(createLeadFormStartedAt());
  const [vehicle, setVehicle] = useState("");
  const [yearGeneration, setYearGeneration] = useState("");
  const [currentWheelSpecs, setCurrentWheelSpecs] = useState("");
  const [preferences, setPreferences] = useState("");
  const [touched, setTouched] = useState({ vehicle: false, yearGeneration: false, currentWheelSpecs: false });
  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestComment, setRequestComment] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>("call");
  const [requestFiles, setRequestFiles] = useState<File[]>([]);
  const [requestConsent, setRequestConsent] = useState(false);
  const [requestConsentTouched, setRequestConsentTouched] = useState(false);
  const [fileError, setFileError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitErrorMessage, setSubmitErrorMessage] = useState(SUBMIT_ERROR);
  const normalizedVehicle = vehicle.trim();
  const normalizedYearGeneration = yearGeneration.trim();
  const normalizedWheelSpecs = currentWheelSpecs.trim();
  const normalizedPreferences = preferences.trim();
  const isComplete = Boolean(normalizedVehicle && normalizedYearGeneration && normalizedWheelSpecs);

  function handleVehicleChange(value: string) {
    setVehicle(value.replace(/[^\p{L}\p{N}\s./-]/gu, ""));
  }

  function markTouched(field: keyof typeof touched) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function clearRequestFiles() {
    setRequestFiles([]);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRequestFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    setSubmitStatus("idle");

    if (selected.length > MAX_FILES) {
      setFileError(`Можно прикрепить не более ${MAX_FILES} фотографий.`);
      event.target.value = "";
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileError(`Файл «${oversized.name}» превышает максимальный размер 10 МБ.`);
      event.target.value = "";
      return;
    }

    const unsupported = selected.find((file) => !ALLOWED_FILE_TYPES.has(file.type));
    if (unsupported) {
      setFileError(`Файл «${unsupported.name}» имеет неподдерживаемый формат.`);
      event.target.value = "";
      return;
    }

    setRequestFiles(selected);
    setFileError("");
  }

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus("idle");
    setSubmitErrorMessage(SUBMIT_ERROR);

    const name = requestName.trim();
    const phone = requestPhone.trim();
    if (!name || !phone || !requestConsent || fileError) {
      if (!requestConsent) setRequestConsentTouched(true);
      return;
    }

    const formData = new FormData();
    formData.append("source", "home_fitment_form");
    formData.append("fitment_car", normalizedVehicle);
    formData.append("fitment_year_generation", normalizedYearGeneration);
    formData.append("fitment_current_wheels", normalizedWheelSpecs);
    formData.append("fitment_wishes", normalizedPreferences || "не указано");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("comment", requestComment.trim());
    formData.append("personal_data_consent", "true");
    formData.append("policy_accepted", "true");
    formData.append("preferred_contact_method", preferredContactMethod);
    formData.append("preferred_contact", preferredContactMethod);
    requestFiles.forEach((file) => {
      formData.append("photos", file);
      console.debug("Lead photo added to FormData", {
        field: "photos",
        name: file.name,
        type: file.type,
        size: file.size,
      });
    });
    appendLeadSecurityFields(formData, formStartedAtRef.current);

    setSubmitStatus("submitting");
    try {
      await submitContact(formData);
      reachGoal("form_lead_success", { source: "home_fitment_form" });
      setRequestName("");
      setRequestPhone("");
      setRequestComment("");
      setRequestConsent(false);
      setPreferredContactMethod("call");
      setRequestConsentTouched(false);
      formStartedAtRef.current = createLeadFormStartedAt();
      clearRequestFiles();
      setSubmitStatus("success");
    } catch (error) {
      setSubmitErrorMessage(error instanceof ApiRequestError ? error.message : SUBMIT_ERROR);
      setSubmitStatus("error");
    }
  }

  return (
    <section className="fitment-page relative overflow-x-clip overflow-y-visible px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute -right-52 top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/14 blur-3xl" />
      <div className="absolute -left-52 top-[34rem] -z-10 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <LiquidCard className="selection-intro relative min-h-[21rem] overflow-hidden rounded-[1.5rem] p-7 sm:min-h-[24rem] sm:rounded-[2rem] sm:p-12 lg:p-16">
            <div className="absolute inset-0">
              <Image
                src="/images/fitment/diski-pod-podbor.png"
                alt="Кованые диски PRIDE перед подбором параметров"
                fill
                priority
                sizes="1180px"
                className="selection-intro-image object-cover"
              />
              <div className="selection-intro-overlay absolute inset-0" />
            </div>
            <div className="selection-intro-glow absolute -right-20 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex min-h-[17rem] min-w-0 items-end sm:min-h-[18rem]">
              <div className="max-w-[48rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm sm:tracking-[0.35em]">PRIDE Selection</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] text-primary sm:text-6xl lg:text-7xl">
                  Подбор дисков
                </h1>
                <p className="mt-5 max-w-[45rem] text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
                  Укажите параметры автомобиля и желаемую посадку — мы проверим совместимость, подберём оптимальные размеры и подготовим персональное предложение.
                </p>
              </div>
            </div>
          </LiquidCard>
        </motion.div>

        <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
              <LiquidCard className="rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-7">
                <div className="grid gap-5">
                  <ManualField
                    label="1. Автомобиль"
                    value={vehicle}
                    placeholder="Например: BMW 3 Series G20"
                    maxLength={60}
                    required
                    onChange={handleVehicleChange}
                    onBlur={() => markTouched("vehicle")}
                    error={touched.vehicle && !normalizedVehicle ? "Укажите автомобиль" : undefined}
                  />
                  <ManualField
                    label="2. Год / поколение"
                    value={yearGeneration}
                    placeholder="Например: 2021 или G20"
                    maxLength={40}
                    required
                    onChange={setYearGeneration}
                    onBlur={() => markTouched("yearGeneration")}
                    error={touched.yearGeneration && !normalizedYearGeneration ? "Укажите год или поколение" : undefined}
                  />
                  <ManualField
                    label="3. Параметры дисков"
                    value={currentWheelSpecs}
                    placeholder="Например: R19 8.5J ET35 5x112 DIA 66.6"
                    maxLength={80}
                    required
                    onChange={setCurrentWheelSpecs}
                    onBlur={() => markTouched("currentWheelSpecs")}
                    error={touched.currentWheelSpecs && !normalizedWheelSpecs ? "Укажите текущие параметры дисков" : undefined}
                  />
                  <ManualField
                    label="4. Пожелания"
                    value={preferences}
                    placeholder="Например: ниже посадка, шире колесо, агрессивнее вид"
                    maxLength={160}
                    multiline
                    onChange={setPreferences}
                    onBlur={() => undefined}
                  />
                </div>
              </LiquidCard>
            </motion.div>

            <div className="min-h-[28rem] min-w-0">
              <AnimatePresence mode="wait">
                {!isComplete ? (
                  <motion.div key="manual-empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                    <LiquidCard className="flex min-h-[28rem] items-center rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Результат</p>
                        <h2 className="mt-4 text-2xl font-black text-primary sm:text-4xl">Расскажите о вашем автомобиле</h2>
                        <p className="mt-4 max-w-xl text-base leading-7 text-graphite/70">
                          Укажите модель, год и текущие параметры дисков — после этого мы подготовим форму заявки для обратной связи.
                        </p>
                      </div>
                    </LiquidCard>
                  </motion.div>
                ) : (
                  <motion.div key="manual-result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                    <LiquidCard className="rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-7">
                      <div className="grid gap-6">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Заявка</p>
                          <h2 className="mt-3 text-2xl font-black text-primary sm:text-3xl">Получить обратную связь</h2>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-graphite/70">
                            Мы проверим параметры, посадку и совместимость, а затем свяжемся с вами.
                          </p>
                        </div>

                        <div>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Ваши параметры</p>
                          <dl className="grid gap-3 sm:grid-cols-2">
                          {[
                            ["Автомобиль", normalizedVehicle],
                            ["Год / поколение", normalizedYearGeneration],
                            ["Текущие параметры", normalizedWheelSpecs],
                            ["Пожелания", normalizedPreferences || "не указано"]
                          ].map(([label, value]) => (
                            <div key={label} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">{label}</dt>
                              <dd className="mt-2 break-words text-sm font-bold leading-6 text-[var(--text-primary)]">{value}</dd>
                            </div>
                          ))}
                          </dl>
                        </div>

                        <form className="fitment-request-form grid gap-4" onSubmit={handleRequestSubmit}>
                          <LeadHoneypotFields formStartedAt={formStartedAtRef.current} />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              name="name"
                              value={requestName}
                              onChange={(event) => setRequestName(event.target.value)}
                              placeholder="Ваше имя"
                              maxLength={60}
                              required
                              autoComplete="name"
                              className="fitment-request-control"
                            />
                            <input
                              name="phone"
                              value={requestPhone}
                              onChange={(event) => setRequestPhone(event.target.value)}
                              placeholder="+7 993 289-10-33"
                              maxLength={30}
                              required
                              inputMode="tel"
                              autoComplete="tel"
                              className="fitment-request-control"
                            />
                          </div>
                          <textarea
                            name="comment"
                            value={requestComment}
                            onChange={(event) => setRequestComment(event.target.value)}
                            placeholder="Можно добавить детали проекта"
                            maxLength={300}
                            className="fitment-request-control fitment-request-comment"
                          />

                          <ContactMethodPicker value={preferredContactMethod} onChange={setPreferredContactMethod} />

                          <div className="fitment-request-files">
                            <input
                              ref={fileInputRef}
                              id="fitment-request-files"
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                              multiple
                              onChange={handleRequestFiles}
                              disabled={submitStatus === "submitting"}
                              className="sr-only"
                            />
                            <div className="flex flex-wrap items-center gap-3">
                              <label htmlFor="fitment-request-files" className="fitment-request-file-button">Прикрепить фото автомобиля или пример дисков</label>
                              {requestFiles.length > 0 ? (
                                <button type="button" onClick={clearRequestFiles} className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)]">Очистить</button>
                              ) : null}
                              <span className="text-xs text-[var(--text-secondary)]">До 5 фото, каждое до 10 МБ</span>
                            </div>
                            {requestFiles.length > 0 ? (
                              <ul className="mt-2 grid gap-1 text-xs text-[var(--text-secondary)]">
                                {requestFiles.map((file) => <li key={`${file.name}-${file.size}`} className="truncate">{file.name}</li>)}
                              </ul>
                            ) : null}
                            {fileError ? <p className="mt-2 text-xs font-medium text-red-400" role="alert">{fileError}</p> : null}
                          </div>

                          <div className="contact-consent-group">
                            <label className="contact-consent">
                              <input
                                type="checkbox"
                                checked={requestConsent}
                                onChange={(event) => {
                                  setRequestConsent(event.target.checked);
                                  setRequestConsentTouched(true);
                                }}
                                onBlur={() => setRequestConsentTouched(true)}
                                aria-invalid={requestConsentTouched && !requestConsent}
                              />
                              <span className="contact-consent-box" aria-hidden="true">
                                <svg viewBox="0 0 16 16" focusable="false"><path d="m3.25 8.2 3.05 3.05 6.45-6.5" /></svg>
                              </span>
                              <span className="contact-consent-copy">
                                Я согласен на <a href="/docs/personal-data-consent.pdf" target="_blank" rel="noopener noreferrer">обработку персональных данных</a> и ознакомлен с <a href="/docs/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>.
                              </span>
                            </label>
                            {requestConsentTouched && !requestConsent ? <p className="contact-consent-error" role="alert">Необходимо согласие на обработку персональных данных.</p> : null}
                          </div>

                          {submitStatus === "success" ? <p className="text-sm font-semibold text-emerald-400" role="status">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p> : null}
                          {submitStatus === "error" ? <p className="text-sm font-semibold text-red-400" role="alert">{submitErrorMessage}</p> : null}

                          <Button type="submit" size="lg" className="w-full" disabled={submitStatus === "submitting" || Boolean(fileError)}>
                            {submitStatus === "submitting" ? "Отправляем..." : "Отправить заявку"}
                          </Button>
                        </form>
                      </div>
                    </LiquidCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

      </div>
    </section>
  );
}
