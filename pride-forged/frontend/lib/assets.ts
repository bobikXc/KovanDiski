import type { Wheel } from "@/lib/api";

export const heroWheelImage = "/images/wheels/apex.jpg";
export const heroShowcaseImage = "/images/hero/hero-wheel.jpg";
export const aboutWorkshopImage = "/images/about/about-workshop.jpg";
export const carsLineupImage = "/images/cars/cars-lineup.jpg";

const modelImages: Record<string, string> = {
  "pride-apex": "/images/wheels/apex.jpg",
  "pride-vector": "/images/wheels/vector.jpg",
  "pride-storm": "/images/wheels/storm.jpg",
  "pride-blade": "/images/wheels/blade.jpg",
  "pride-mono": "/images/wheels/mono.jpg",
  "pride-titan": "/images/wheels/titan.jpg",
  "pride-r-line": "/images/wheels/vector.jpg",
  "pride-gt": "/images/wheels/storm.jpg",
  "pride-evo": "/images/wheels/blade.jpg",
  "pride-rs": "/images/wheels/apex.jpg",
  "pride-vortex": "/images/wheels/titan.jpg",
  "pride-nero": "/images/wheels/mono.jpg"
};

const fallbackWheelImages = [
  "/images/wheels/apex.jpg",
  "/images/wheels/vector.jpg",
  "/images/wheels/storm.jpg",
  "/images/wheels/blade.jpg",
  "/images/wheels/mono.jpg",
  "/images/wheels/titan.jpg"
];

function normalize(value?: string) {
  return value?.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "") ?? "";
}

export function getWheelAsset(wheel: Wheel, index = 0) {
  const slugKey = normalize(wheel.slug);
  const nameKey = normalize(wheel.name);
  const mapped = modelImages[slugKey] ?? modelImages[nameKey];

  if (mapped) {
    return mapped;
  }

  const apiImage = wheel.images?.[0]?.image_url;
  if (apiImage?.startsWith("/images/")) {
    return apiImage;
  }

  return fallbackWheelImages[index % fallbackWheelImages.length];
}
