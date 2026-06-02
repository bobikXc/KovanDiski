import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Brand } from "@/lib/api";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/vehicles/${brand.slug}`} className="block h-full">
      <Card className="h-full p-7 text-center transition hover:-translate-y-1 hover:border-accent/60">
        <p className="text-2xl font-black">{brand.name}</p>
        <p className="mt-3 text-sm text-white/60">{brand.models?.length ?? 0} моделей в подборе</p>
      </Card>
    </Link>
  );
}
