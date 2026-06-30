import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { TrackedAnchor } from "@/components/tracked-link";

const footerLinks = [
  ["Каталог", "/catalog"],
  ["Подбор дисков", "/fitment"],
  ["Калькулятор", "/tools/wheel-calculator"],
  ["О компании", "/about"],
  ["Контакты", "/contact"]
];

const socialLinks = [
  ["Telegram", "https://t.me/pride_forged"],
  ["WhatsApp", "https://wa.me/message/3JNO6WG3RTMTM1"],
  ["MAX", "https://max.ru/u/f9LHodD0cOKgLFob6TakxBenvXyB_sdHBNXxxh-OqKuv1dEmcqPP5ldf1VQ"]
];

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <BrandLogo imageClassName="h-12" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-graphite/60">
            Премиальные кованые диски, созданные под характер автомобиля, точный fitment и стиль владельца.
          </p>
        </div>
        <nav className="grid gap-3 text-sm text-graphite">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-accent">
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-sm leading-7 text-graphite">
          <p className="font-semibold text-primary">PRIDE contacts</p>
          <p className="mt-2">Россия, Москва, Рябиновая улица, 55с8</p>
          <TrackedAnchor href="tel:+79932891033" goal="click_phone" params={{ location: "footer" }} className="block transition hover:text-accent">+7 993 289-10-33</TrackedAnchor>
          <a href="mailto:prideforged@yandex.ru" className="block transition hover:text-accent">prideforged@yandex.ru</a>
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map(([label, href]) => (
              <TrackedAnchor
                key={label}
                href={href}
                goal={label === "Telegram" ? "click_telegram" : label === "WhatsApp" ? "click_whatsapp" : "click_max"}
                params={{ location: "footer" }}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary/10 px-3 py-1 text-xs font-bold text-primary transition hover:border-accent hover:text-accent"
              >
                {label}
              </TrackedAnchor>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary/10 px-4 py-5 text-xs text-graphite/60">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start">
          <div className="space-y-3 text-center md:text-left">
            <p className="uppercase tracking-[0.24em]">© 2026 PRIDE Forged. Bespoke forged wheels.</p>
            <div className="space-y-1 leading-5">
              <p className="font-semibold text-graphite/80">Юридическая информация</p>
              <p>Индивидуальный предприниматель Щукин Александр Александрович</p>
              <p>ИНН 772459989795</p>
              <p>ОГРНИП 321774600628100</p>
              <p>Юридический адрес: 119634, Россия, г. Москва, улица Лукинская, д. 8, корп. 3</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-end" aria-label="Правовая информация">
            <a href="/docs/user-agreement.pdf" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent">Пользовательское соглашение</a>
            <a href="/docs/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent">Политика конфиденциальности</a>
            <a href="/docs/personal-data-consent.pdf" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent">Согласие на обработку персональных данных</a>
            <Link href="/cookies" className="transition hover:text-accent">Политика cookie</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
