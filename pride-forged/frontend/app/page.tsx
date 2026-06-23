import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandAboutSection } from "@/components/brand-about-section";
import { DealProcessSection } from "@/components/deal-process-section";
import { CTASection } from "@/components/sections/CTASection";
import { FeaturedWheels } from "@/components/sections/FeaturedWheels";
import { HeroSection } from "@/components/sections/HeroSection";
import { PaintSection } from "@/components/paint-section";
import { ProductionSection } from "@/components/production-section";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { VisualizationSection } from "@/components/visualization-section";
import { getSiteData } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { brandsWithModels: brands, wheels } = await getSiteData();

  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <VisualizationSection />
      <FeaturedWheels wheels={wheels} />
      <DealProcessSection />
      <BrandAboutSection />
      <ProductionSection />
      <PaintSection />
      <VehicleSelector brands={brands} />
      <CTASection />
    </>
  );
}
