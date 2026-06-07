import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showText?: boolean;
};

export function BrandLogo({ className, imageClassName, priority = false, showText = true }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="PRIDE Forged">
      <Image
        src="/brand/pride-logo.png"
        alt="PRIDE"
        width={160}
        height={160}
        priority={priority}
        className={cn("h-9 w-auto object-contain brightness-0 invert", imageClassName)}
      />
      {showText && (
        <span className="leading-none">
          <span className="block text-lg font-black uppercase tracking-[0.16em] text-primary">PRIDE</span>
          <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-accent">Forged</span>
        </span>
      )}
    </Link>
  );
}
