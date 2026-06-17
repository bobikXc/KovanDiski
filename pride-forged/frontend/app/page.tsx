import { AboutSection } from "@/components/sections/AboutSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { CTASection } from "@/components/sections/CTASection";
import { FeaturedWheels } from "@/components/sections/FeaturedWheels";
import { HeroSection } from "@/components/sections/HeroSection";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { WheelCalculatorCTA } from "@/components/wheel-calculator-cta";
import { safeGetBrandsWithModels, safeGetWheels } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [brands, wheels] = await Promise.all([safeGetBrandsWithModels(), safeGetWheels()]);

  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <FeaturedWheels wheels={wheels} />
      <VehicleSelector brands={brands} />
      <WheelCalculatorCTA />
      <AboutSection />
      <CTASection />
    </>
  );
}
