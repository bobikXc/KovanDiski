import * as React from "react";

import { cn } from "@/lib/utils";

type LiquidCardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function LiquidCard({ className, interactive = false, ...props }: LiquidCardProps) {
  return (
    <div
      className={cn(
        "liquid-card rounded-[2rem] shadow-liquid",
        interactive && "transition duration-300 hover:scale-[1.03] hover:border-white/70 hover:shadow-liquidHover",
        className
      )}
      {...props}
    />
  );
}
