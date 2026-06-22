import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "О компании — PRIDE Forged" };

const advantages = [
  {
    title: "Точная посадка",
    text: "Проверяем параметры под кузов, тормозную систему, клиренс и желаемый визуальный результат."
  },
  {
    title: "Кованая основа",
    text: "Работаем с прочной заготовкой и контролируем массу, жёсткость и ресурс каждого комплекта."
  },
  {
    title: "Индивидуальная отделка",
    text: "Подбираем цвет, фактуру и сочетание финиша под автомобиль: gloss, satin, matte, brushed и комбинированные варианты."
  },
  {
    title: "Сопровождение проекта",
    text: "Ведём клиента от идеи и визуализации до готового комплекта, установки и рекомендаций по уходу."
  }
];

const brandParagraphs = [
  "PRIDE — это не просто магазин. Это пространство, где ценят стиль, понимают технику и говорят на одном языке с автолюбителями.",
  "Наша компания специализируется на производстве и продаже кованых дисков. Мы создаём диски, которые подчеркивают индивидуальность автомобиля и обеспечивают максимальную надёжность на дороге.",
  "Обратившись в PRIDE, вы можете быть уверены в том, что покупаете не просто комплект дисков. Мы сопровождаем клиента от первого вопроса до момента установки.",
  "Все процессы выстроены внутри компании, что позволяет нам предлагать честные сроки, выгодные цены и гарантии.",
  "Мы уверены: кованые диски должны не только быть прочными и лёгкими, но и идеально вписываться в образ автомобиля."
];

function AboutConsultation() {
  return (
    <section className="about-consultation">
      <div className="about-consultation-grid">
        <div className="about-consultation-copy">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Консультация</p>
            <h2>Соберём комплект под ваш автомобиль и стиль вождения</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="about-consultation-description">
              Оставьте заявку — специалист PRIDE уточнит параметры, предложит дизайн и рассчитает стоимость производства.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Button asChild size="lg" variant="secondary" className="mt-8 w-full shadow-[0_18px_40px_rgba(74,111,165,0.28)] sm:w-auto">
              <Link href="/contact">Связаться с PRIDE</Link>
            </Button>
          </Reveal>
        </div>

        <Reveal className="about-consultation-visual" delay={0.08} amount={0.12}>
          <div className="about-consultation-image-shell">
            <Image
              src="/images/IMG_3166.JPG"
              alt="Кованый диск на автомобиле PRIDE"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="about-consultation-image"
            />
            <div className="about-consultation-image-overlay" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="about-page-hero" aria-labelledby="about-page-title">
        <div className="about-page-hero-grid">
          <Reveal className="about-page-media" amount={0.08}>
            <Image
              src="/images/about/cnc-03.jpg"
              alt="Производство кованых дисков PRIDE Forged на станке с ЧПУ"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="about-page-image"
            />
            <div className="about-page-media-overlay" aria-hidden="true" />
          </Reveal>

          <div className="about-page-content">
            <Reveal className="about-page-heading">
              <p className="about-page-label">О БРЕНДЕ</p>
              <h1 id="about-page-title">PRIDE Forged — кованые диски под характер автомобиля</h1>
              <div className="about-page-description about-page-story">
                {brandParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </Reveal>

            <div className="about-page-grid">
              {advantages.map((advantage, index) => (
                <Reveal key={advantage.title} className="about-page-card-wrap" delay={0.08 + index * 0.07} amount={0.1}>
                  <article className="about-page-card">
                    <h2>{advantage.title}</h2>
                    <p>{advantage.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AboutConsultation />
    </>
  );
}
