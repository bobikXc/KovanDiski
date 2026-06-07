import * as React from "react";

import { cn } from "@/lib/utils";

type LiquidGlassProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function LiquidGlass({ className, interactive = false, ...props }: LiquidGlassProps) {
  return (
    <div
      className={cn(
        "liquid-glass rounded-[1.5rem] shadow-liquid",
        interactive && "transition duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-liquidHover",
        className
      )}
      {...props}
    />
  );
}

export function LiquidCard(props: LiquidGlassProps) {
  return <LiquidGlass {...props} />;
}
