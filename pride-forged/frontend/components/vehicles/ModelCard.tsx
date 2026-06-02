import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Brand, VehicleModel } from "@/lib/api";

function yearsLabel(model: VehicleModel) {
  if (!model.year_from && !model.year_to) return "в базе";
  if (model.year_from && model.year_to) return `${model.year_from}–${model.year_to}`;
  if (model.year_from) return `${model.year_from}+`;
  return `до ${model.year_to}`;
}

export function ModelCard({ brand, model }: { brand: Brand; model: VehicleModel }) {
  return (
    <Link href={`/vehicles/${brand.slug}/${model.slug}`} className="block h-full">
      <Card className="h-full p-7 transition hover:-translate-y-1 hover:border-accent/60">
        <p className="text-2xl font-black">{model.name}</p>
        <p className="mt-3 text-white/60">Fitment {yearsLabel(model)}</p>
      </Card>
    </Link>
  );
}
