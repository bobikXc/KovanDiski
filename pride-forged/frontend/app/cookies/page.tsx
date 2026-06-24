import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика использования cookie — PRIDE Forged",
  description: "Информация об использовании файлов cookie на сайте PRIDE Forged."
};

const cookieCategories = [
  {
    title: "Обязательные cookie",
    description: "Необходимы для стабильной и безопасной работы сайта.",
    items: [
      "обеспечивают работу основных функций сайта",
      "сохраняют выбранную тему",
      "сохраняют настройки cookie",
      "поддерживают корректную работу форм и интерфейса"
    ]
  },
  {
    title: "Аналитические cookie",
    description: "Могут использоваться при подключении соответствующих сервисов и только с согласия пользователя.",
    items: [
      "помогают понимать, какие страницы посещают пользователи",
      "помогают улучшать структуру и удобство сайта",
      "их можно отключить в настройках cookie"
    ]
  },
  {
    title: "Маркетинговые cookie",
    description: "Могут использоваться при подключении рекламных или ретаргетинговых сервисов и только с согласия пользователя.",
    items: [
      "могут поддерживать работу рекламных инструментов",
      "могут использоваться для ретаргетинга",
      "их можно отключить в настройках cookie"
    ]
  }
];

export default function CookiesPage() {
  return (
    <main className="privacy-page cookie-policy-page">
      <div className="privacy-shell">
        <header className="privacy-header">
          <p className="privacy-eyebrow">PRIDE FORGED · COOKIE</p>
          <h1>Политика использования cookie</h1>
          <p className="privacy-lead">
            Эта политика объясняет, какие файлы cookie может использовать сайт PRIDE Forged и как вы можете управлять своим выбором.
          </p>
          <p className="privacy-draft-note">
            Текст политики является базовым шаблоном и может быть дополнен владельцем сайта.
          </p>
        </header>

        <div className="privacy-content">
          <section className="privacy-section">
            <span className="privacy-section-number">01</span>
            <div>
              <h2>Что такое cookie</h2>
              <p>
                Cookie — это небольшие файлы, которые сайт сохраняет в браузере пользователя для корректной работы сайта и улучшения пользовательского опыта.
              </p>
            </div>
          </section>

          <section className="privacy-section">
            <span className="privacy-section-number">02</span>
            <div>
              <h2>Какие cookie мы используем</h2>
              <div className="cookie-policy-categories">
                {cookieCategories.map((category) => (
                  <article key={category.title} className="cookie-policy-category">
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                    <ul>
                      {category.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <span className="privacy-section-number">03</span>
            <div>
              <h2>Как управлять cookie</h2>
              <p>При первом посещении сайта вы можете выбрать подходящий вариант:</p>
              <ul>
                <li>принять все cookie</li>
                <li>отклонить необязательные cookie</li>
                <li>отдельно настроить аналитические и маркетинговые cookie</li>
                <li>изменить или удалить cookie в настройках браузера</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section privacy-contacts">
            <span className="privacy-section-number">04</span>
            <div>
              <h2>Контакты</h2>
              <p>По вопросам использования cookie можно связаться с PRIDE Forged:</p>
              <div className="privacy-contact-links">
                <a href="tel:+79999999999">+7 (999) 999-99-99</a>
                <a href="mailto:sales@pride-forged.ru">sales@pride-forged.ru</a>
              </div>
            </div>
          </section>
        </div>

        <Link href="/privacy" className="privacy-back-link">Политика конфиденциальности</Link>
      </div>
    </main>
  );
}
