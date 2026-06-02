import { redirect } from "next/navigation";

export default async function CarsModelRedirectPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { brand, model } = await params;
  redirect(`/vehicles/${brand}/${model}`);
}
