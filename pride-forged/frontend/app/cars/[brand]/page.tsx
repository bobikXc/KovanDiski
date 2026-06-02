import { redirect } from "next/navigation";

export default async function CarsBrandRedirectPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  redirect(`/vehicles/${brand}`);
}
