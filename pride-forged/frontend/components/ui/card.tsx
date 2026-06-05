import * as React from "react";

import { LiquidCard } from "@/components/ui/liquid-card";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <LiquidCard className={cn("rounded-3xl", className)} {...props} />;
}
