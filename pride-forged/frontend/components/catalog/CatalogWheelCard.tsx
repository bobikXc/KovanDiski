import Image from "next/image";
import Link from "next/link";

import { formatWheelPrice } from "@/components/catalog/WheelCard";
import { normalizeWheelImages } from "@/lib/assets";
import type { Wheel } from "@/lib/api";

function compactWheelSpecs(wheel: Wheel) {
  return [
    wheel.diameter ? `${wheel.diameter}″` : null,
    wheel.width ? `${wheel.width}J` : null,
    wheel.et !== null && wheel.et !== undefined ? `ET${wheel.et}` : null,
    wheel.pcd || null
  ].filter((value): value is string => Boolean(value));
}

export function CatalogWheelCard({ wheel }: { wheel: Wheel }) {
  const images = normalizeWheelImages(wheel);
  const mainImage = images[0];
  const hoverImage = images[1] ?? mainImage;
  const specs = compactWheelSpecs(wheel);

  return (
    <Link href={`/catalog/${wheel.slug}`} className="catalog-wheel-card group">
      <div className="catalog-wheel-image-wrap">
        <div className="catalog-wheel-image-halo" aria-hidden="true" />
        <Image
          src={mainImage}
          alt={`Кованый диск ${wheel.name}`}
          fill
          priority={false}
          unoptimized
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="catalog-wheel-image catalog-wheel-image-main"
        />
        <Image
          src={hoverImage}
          alt=""
          fill
          unoptimized
          aria-hidden="true"
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="catalog-wheel-image catalog-wheel-image-hover"
        />
        <span className="catalog-wheel-view-label">Смотреть модель</span>
      </div>

      <div className="catalog-wheel-info">
        <h2>{wheel.name}</h2>
        {specs.length > 0 && <p className="catalog-wheel-specs">{specs.join(" · ")}</p>}
        <p className="catalog-wheel-price">{formatWheelPrice(wheel.price)}</p>
        <span className="catalog-wheel-accent" aria-hidden="true" />
      </div>
    </Link>
  );
}
