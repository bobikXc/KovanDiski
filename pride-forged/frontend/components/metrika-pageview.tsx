"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { metrikaHit } from "@/lib/metrika";

export function MetrikaPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    metrikaHit(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
