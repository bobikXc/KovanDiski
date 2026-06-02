import { CTASection } from "@/components/sections/CTASection";

export const metadata = { title: "О компании — PRIDE Forged" };

const paragraphs = [
  "PRIDE — это не просто магазин. Это пространство, где ценят стиль, понимают технику и говорят на одном языке с автолюбителями.",
  "Наша компания специализируется на производстве и продаже кованых дисков. Мы создаём диски, которые подчеркивают индивидуальность автомобиля и обеспечивают максимальную надёжность на дороге.",
  "Обратившись в PRIDE, вы можете быть уверены в том, что покупаете не просто комплект дисков. Мы сопровождаем клиента от первого вопроса до момента установки.",
  "Все процессы выстроены внутри компании, что позволяет нам предлагать честные сроки, выгодные цены и гарантии.",
  "Мы уверены: кованые диски должны не только быть прочными и лёгкими, но и идеально вписываться в образ автомобиля."
];

export default function AboutPage() {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">О компании</p>
            <h1 className="mt-4 text-5xl font-black">PRIDE Forged</h1>
          </div>
          <div className="space-y-6 text-lg leading-9 text-white/72">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
