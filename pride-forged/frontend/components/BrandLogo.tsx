import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showText?: boolean;
  textClassName?: string;
  subTextClassName?: string;
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  showText = true,
  textClassName,
  subTextClassName
}: BrandLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="PRIDE Forged">
      <Image
        src="/brand/pride-logo.png"
        alt="PRIDE"
        width={160}
        height={160}
        priority={priority}
        className={cn("brand-logo-image h-9 w-auto object-contain", imageClassName)}
      />
      {showText && (
        <span className="leading-none">
          <span className={cn("block text-lg font-black uppercase tracking-[0.16em] text-primary", textClassName)}>PRIDE</span>
          <span className={cn("mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-accent", subTextClassName)}>Forged</span>
        </span>
      )}
    </Link>
  );
}
