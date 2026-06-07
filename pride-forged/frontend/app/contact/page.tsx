"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ContactForm = { name: string; phone: string; car: string; message: string };

const inputClass =
  "h-12 rounded-2xl border border-primary/10 bg-surface/70 px-5 text-primary outline-none transition placeholder:text-graphite/45 focus:border-accent focus:ring-4 focus:ring-accent/15";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  function onSubmit() {
    reset();
  }

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute -right-40 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Контакты</p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-none tracking-[-0.05em] text-primary sm:text-6xl">Обсудим ваш проект</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-graphite">
            Расскажите об автомобиле и желаемой посадке. Мы проверим параметры, предложим дизайн и подскажем следующий шаг.
          </p>
          <div className="mt-8 grid gap-3 text-graphite">
            {["Москва, премиальный шоурум PRIDE Forged", "+7 (495) 000-00-00", "sales@pride-forged.ru"].map((item) => (
              <div key={item} className="rounded-2xl border border-primary/10 bg-surface/45 px-5 py-4">{item}</div>
            ))}
          </div>
        </div>
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <input {...register("name", { required: true })} placeholder="Ваше имя" className={inputClass} />
            <input {...register("phone", { required: true })} placeholder="Телефон" className={inputClass} />
            <input {...register("car")} placeholder="Автомобиль" className={inputClass} />
            <textarea {...register("message")} placeholder="Комментарий" rows={5} className={`${inputClass} h-auto p-5`} />
            <Button type="submit" size="lg">Отправить заявку</Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
