"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "pride_cookie_consent";

type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
};

type CookieToggleProps = {
  checked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onChange?: () => void;
};

function CookieToggle({ checked, description, disabled = false, label, onChange }: CookieToggleProps) {
  return (
    <div className="cookie-consent-option">
      <div>
        <p className="cookie-consent-option-title">{label}</p>
        <p className="cookie-consent-option-description">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onChange}
        className="cookie-consent-toggle"
      >
        <span className="cookie-consent-toggle-thumb" />
      </button>
    </div>
  );
}

export function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(window.localStorage.getItem(STORAGE_KEY) === null);
    } catch {
      setIsVisible(true);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!showSettings) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSettings(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSettings]);

  const saveConsent = (preferences: Pick<ConsentPreferences, "analytics" | "marketing">) => {
    const consent: ConsentPreferences = {
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      acceptedAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // The choice still closes the banner if browser storage is unavailable.
    } finally {
      setShowSettings(false);
      setIsVisible(false);
    }
  };

  if (!isReady || !isVisible) return null;

  return (
    <div className="cookie-consent-layer" aria-live="polite">
      <section
        className="cookie-consent-panel"
        aria-label="Настройки cookie"
        role={showSettings ? "dialog" : "region"}
        aria-modal={showSettings || undefined}
      >
        <div className="cookie-consent-accent" aria-hidden="true" />

        {showSettings ? (
          <>
            <div className="cookie-consent-heading">
              <div>
                <p className="cookie-consent-eyebrow">PRIDE · PRIVACY</p>
                <h2>Настройки cookie</h2>
              </div>
              <button
                type="button"
                className="cookie-consent-close"
                onClick={() => setShowSettings(false)}
                aria-label="Закрыть настройки cookie"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="cookie-consent-options">
              <CookieToggle
                checked
                disabled
                label="Обязательные cookie"
                description="Нужны для работы сайта и сохранения выбранных настроек."
              />
              <CookieToggle
                checked={analytics}
                onChange={() => setAnalytics((value) => !value)}
                label="Аналитические cookie"
                description="Помогают анализировать посещаемость и улучшать сайт."
              />
              <CookieToggle
                checked={marketing}
                onChange={() => setMarketing((value) => !value)}
                label="Маркетинговые cookie"
                description="Могут использоваться для рекламных и ретаргетинговых инструментов."
              />
            </div>

            <div className="cookie-consent-actions cookie-consent-settings-actions">
              <button
                type="button"
                className="cookie-consent-button cookie-consent-button-primary"
                onClick={() => saveConsent({ analytics, marketing })}
              >
                Сохранить настройки
              </button>
              <button
                type="button"
                className="cookie-consent-button cookie-consent-button-secondary"
                onClick={() => saveConsent({ analytics: true, marketing: true })}
              >
                Принять все
              </button>
              <button
                type="button"
                className="cookie-consent-button cookie-consent-button-ghost"
                onClick={() => setShowSettings(false)}
              >
                Закрыть
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cookie-consent-copy">
              <p className="cookie-consent-eyebrow">ВАШ ВЫБОР · ВАШИ ДАННЫЕ</p>
              <h2>Мы используем cookie</h2>
              <p>
                Мы применяем обязательные cookie для работы сайта, а также можем использовать аналитические и маркетинговые cookie для улучшения сервиса. Вы можете принять все cookie или отключить необязательные.
              </p>
              <Link href="/cookies" className="cookie-consent-policy-link">
                Политика cookie
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="cookie-consent-actions">
              <button
                type="button"
                className="cookie-consent-button cookie-consent-button-primary"
                onClick={() => saveConsent({ analytics: true, marketing: true })}
              >
                Принять все
              </button>
              <button
                type="button"
                className="cookie-consent-button cookie-consent-button-secondary"
                onClick={() => saveConsent({ analytics: false, marketing: false })}
              >
                Только необходимые
              </button>
              <button
                type="button"
                className="cookie-consent-button cookie-consent-button-ghost"
                onClick={() => setShowSettings(true)}
              >
                Настроить
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
