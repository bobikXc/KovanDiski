import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  default: "metal-sheen !border-accent/45 !bg-accent/90 text-white shadow-[0_18px_48px_rgba(62,110,168,0.30)] hover:-translate-y-0.5 hover:!bg-accent hover:shadow-[0_22px_62px_rgba(62,110,168,0.42)]",
  secondary: "metal-sheen !border-primary/20 !bg-primary/95 text-secondary shadow-[0_18px_48px_rgb(var(--text-primary-rgb)/0.10)] hover:-translate-y-0.5 hover:!bg-white",
  outline: "liquid-glass !border-primary/16 !bg-surface/35 text-primary hover:-translate-y-0.5 hover:!border-accent/45 hover:!bg-surface/55",
  ghost: "!border-transparent !bg-transparent text-primary shadow-none hover:-translate-y-0.5 hover:!bg-surface/45"
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-6 py-2",
  lg: "h-[3.25rem] px-8 py-4 text-base"
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className)
    });
  }

  if (props.href) {
    return <Link className={classes} href={props.href}>{children}</Link>;
  }

  return <button className={classes} {...props}>{children}</button>;
}
