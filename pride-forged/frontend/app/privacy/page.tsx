import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — PRIDE Forged",
  description: "Порядок обработки персональных данных пользователей сайта PRIDE Forged."
};

const sections = [
  {
    title: "Какие данные мы собираем",
    items: [
      "имя",
      "телефон",
      "автомобиль",
      "комментарий",
      "прикреплённые фотографии",
      "технические данные, необходимые для работы сайта"
    ]
  },
  {
    title: "Для чего используются данные",
    items: [
      "обработка заявки",
      "связь с клиентом",
      "подбор параметров дисков",
      "подготовка предложения"
    ]
  }
];

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <div className="privacy-shell">
        <header className="privacy-header">
          <p className="privacy-eyebrow">PRIDE FORGED · ДОКУМЕНТ</p>
          <h1>Политика конфиденциальности</h1>
          <p className="privacy-lead">
            Настоящая политика описывает порядок обработки персональных данных пользователей сайта PRIDE Forged.
          </p>
          <p className="privacy-draft-note">
            Это рабочая редакция документа. Владелец сайта может дополнить её после консультации с юристом.
          </p>
        </header>

        <div className="privacy-content">
          {sections.map((section, index) => (
            <section key={section.title} className="privacy-section">
              <span className="privacy-section-number">0{index + 1}</span>
              <div>
                <h2>{section.title}</h2>
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </section>
          ))}

          <section className="privacy-section">
            <span className="privacy-section-number">03</span>
            <div>
              <h2>Передача данных</h2>
              <p>
                Мы не планируем передавать персональные данные третьим лицам, кроме случаев, когда это необходимо для обработки заявки или предусмотрено законом.
              </p>
            </div>
          </section>

          <section className="privacy-section">
            <span className="privacy-section-number">04</span>
            <div>
              <h2>Хранение данных</h2>
              <p>
                Данные предполагается хранить только в течение срока, необходимого для обработки обращения и связи с клиентом.
              </p>
            </div>
          </section>

          <section className="privacy-section privacy-contacts">
            <span className="privacy-section-number">05</span>
            <div>
              <h2>Контакты</h2>
              <p>По вопросам обработки данных можно связаться с PRIDE Forged:</p>
              <div className="privacy-contact-links">
                <a href="tel:+79932891033">+7 993 289-10-33</a>
                <a href="mailto:prideforged@yandex.ru">prideforged@yandex.ru</a>
              </div>
            </div>
          </section>
        </div>

        <p className="privacy-cookie-note">
          Также вы можете ознакомиться с <Link href="/cookies">политикой использования cookie</Link>.
        </p>
        <Link href="/contact" className="privacy-back-link">Вернуться к форме</Link>
      </div>
    </main>
  );
}
