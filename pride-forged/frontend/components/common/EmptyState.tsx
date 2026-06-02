import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="mx-auto max-w-3xl p-8 text-center">
      <p className="text-2xl font-black">{title}</p>
      <p className="mt-3 text-white/60">{description}</p>
    </Card>
  );
}
