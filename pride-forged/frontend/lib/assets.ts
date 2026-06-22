import type { Wheel } from "@/lib/api";

export const wheelImagesBySlug = {
  "zp-mono-2-ultra-concave": [
    "/images/wheels/zp-mono-2-ultra-concave-01.jpg",
    "/images/wheels/zp-mono-2-ultra-concave-02.jpg",
    "/images/wheels/zp-mono-2-ultra-concave-03.jpg"
  ],
  "zp-mono-3": [
    "/images/wheels/zp-mono-3-01.jpg",
    "/images/wheels/zp-mono-3-02.jpg",
    "/images/wheels/zp-mono-3-03.jpg"
  ],
  "zp-6-1-gm": [
    "/images/wheels/zp-6-1-gm-01.gif",
    "/images/wheels/zp-6-1-gm-02.gif",
    "/images/wheels/zp-6-1-gm-03.gif"
  ],
  "zp-7-1-glm": [
    "/images/wheels/zp-7-1-glm-01.gif",
    "/images/wheels/zp-7-1-glm-02.gif",
    "/images/wheels/zp-7-1-glm-03.gif"
  ],
  "barracuda-razzer": [
    "/images/wheels/barracuda-razzer-01.jpg",
    "/images/wheels/barracuda-razzer-02.jpg",
    "/images/wheels/barracuda-razzer-03.jpg"
  ],
  "brock-b44": [
    "/images/wheels/brock-b44-01.jpg",
    "/images/wheels/brock-b44-02.jpg",
    "/images/wheels/brock-b44-03.jpg"
  ],
  "concaver-cvr1": [
    "/images/wheels/concaver-cvr1-01.jpg",
    "/images/wheels/concaver-cvr1-02.jpg",
    "/images/wheels/concaver-cvr1-03.jpg"
  ],
  "concaver-cvr5": [
    "/images/wheels/concaver-cvr5-01.jpg",
    "/images/wheels/concaver-cvr5-02.jpg",
    "/images/wheels/concaver-cvr5-03.jpg"
  ],
  "japan-racing-sl-01": [
    "/images/wheels/japan-racing-sl-01-01.jpg",
    "/images/wheels/japan-racing-sl-01-02.jpg",
    "/images/wheels/japan-racing-sl-01-03.jpg"
  ],
  "la-chanti-lc-p19": [
    "/images/wheels/la-chanti-lc-p19-01.jpg",
    "/images/wheels/la-chanti-lc-p19-02.jpg",
    "/images/wheels/la-chanti-lc-p19-03.jpg"
  ],
  "sx-wheels-sx1": [
    "/images/wheels/sx-wheels-sx1-01.jpg",
    "/images/wheels/sx-wheels-sx1-02.jpg",
    "/images/wheels/sx-wheels-sx1-03.jpg"
  ],
  "wheelforce-race-three": [
    "/images/wheels/wheelforce-race-three-01.jpg",
    "/images/wheels/wheelforce-race-three-02.jpg",
    "/images/wheels/wheelforce-race-three-03.jpg"
  ],
  "wheelforce-race-two": [
    "/images/wheels/wheelforce-race-two-01.jpg",
    "/images/wheels/wheelforce-race-two-02.jpg",
    "/images/wheels/wheelforce-race-two-03.jpg"
  ]
} as const satisfies Record<string, readonly string[]>;

export const wheelCatalogOrder = Object.keys(wheelImagesBySlug);
export const fallbackWheelImage = wheelImagesBySlug["zp-mono-2-ultra-concave"][0];

export const heroWheelImage = fallbackWheelImage;
export const heroShowcaseImage = "/images/hero/hero-wheel.jpg";
export const aboutWorkshopImage = "/images/about/about-workshop.jpg";
export const carsLineupImage = "/images/cars/cars-lineup.jpg";

function normalize(value?: string) {
  return value?.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "") ?? "";
}

function getApiImages(wheel: Wheel) {
  return (wheel.images ?? [])
    .map((image) => (typeof image === "string" ? image : image?.image_url))
    .filter((image): image is string => typeof image === "string" && image.trim().length > 0);
}

export function normalizeWheelImages(wheel: Wheel): string[] {
  const apiImages = getApiImages(wheel);

  if (apiImages.length > 0) {
    return apiImages;
  }

  const slugKey = normalize(wheel.slug);
  const nameKey = normalize(wheel.name);
  const mappedImages = wheelImagesBySlug[slugKey as keyof typeof wheelImagesBySlug]
    ?? wheelImagesBySlug[nameKey as keyof typeof wheelImagesBySlug];

  if (mappedImages?.length) {
    return [...mappedImages];
  }

  if (typeof wheel.image_url === "string" && wheel.image_url.trim()) {
    return [wheel.image_url];
  }

  return [fallbackWheelImage];
}

export function getWheelImages(wheel: Wheel): readonly string[] {
  return normalizeWheelImages(wheel);
}

export function getWheelAsset(wheel: Wheel, index = 0) {
  const images = getWheelImages(wheel);
  return images[index] ?? images[0] ?? fallbackWheelImage;
}

export function sortWheelsByCatalogOrder(wheels: Wheel[]) {
  const order = new Map(wheelCatalogOrder.map((slug, index) => [slug, index]));

  return [...wheels].sort((left, right) => {
    const leftIndex = order.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = order.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex || left.name.localeCompare(right.name, "ru");
  });
}
