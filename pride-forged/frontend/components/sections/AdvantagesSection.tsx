import { Card } from "@/components/ui/card";

const advantages = [
  ["Собственное производство", "Контроль геометрии, сроков и качества на каждом этапе."],
  ["Инженерный подбор", "Параметры под конкретный кузов, тормоза и сценарий эксплуатации."],
  ["Премиальный сервис", "Сопровождение от первого вопроса до момента установки."]
];

export function AdvantagesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Почему PRIDE</p>
          <h2 className="mt-4 text-3xl font-black sm:text-5xl">Диски, которые работают на образ и динамику</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {advantages.map(([title, text]) => (
            <Card key={title} className="p-7">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-4 leading-7 text-white/64">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
