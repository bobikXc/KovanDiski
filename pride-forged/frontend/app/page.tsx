import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { CTASection } from "@/components/sections/CTASection";
import { FeaturedWheels } from "@/components/sections/FeaturedWheels";
import { HeroSection } from "@/components/sections/HeroSection";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { getBrands, getWheels } from "@/lib/api";

export default async function Home() {
  const [brands, wheels] = await Promise.all([getBrands(), getWheels()]);

  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <FeaturedWheels wheels={wheels} />
      <VehicleSelector brands={brands} />
      <CTASection />
    </>
  );
}
