"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ContactForm = { name: string; phone: string; car: string; message: string };

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  function onSubmit() {
    reset();
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Контакты</p>
          <h1 className="mt-4 text-5xl font-black">Обсудим ваш проект</h1>
          <div className="mt-8 space-y-4 text-graphite/70">
            <p>Москва, премиальный шоурум PRIDE Forged</p>
            <p>+7 (495) 000-00-00</p>
            <p>sales@pride-forged.ru</p>
          </div>
        </div>
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <input {...register("name", { required: true })} placeholder="Ваше имя" className="h-12 rounded-2xl border border-primary/10 bg-white/70 px-5 text-primary placeholder:text-graphite/40" />
            <input {...register("phone", { required: true })} placeholder="Телефон" className="h-12 rounded-2xl border border-primary/10 bg-white/70 px-5 text-primary placeholder:text-graphite/40" />
            <input {...register("car")} placeholder="Автомобиль" className="h-12 rounded-2xl border border-primary/10 bg-white/70 px-5 text-primary placeholder:text-graphite/40" />
            <textarea {...register("message")} placeholder="Комментарий" rows={5} className="rounded-2xl border border-primary/10 bg-white/70 p-5 text-primary placeholder:text-graphite/40" />
            <Button type="submit" size="lg" variant="secondary">Отправить заявку</Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
