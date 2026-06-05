import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline";
type ButtonSize = "default" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  default: "border border-primary bg-primary text-white shadow-[0_18px_40px_rgba(13,27,42,0.18)] hover:bg-accent hover:border-accent",
  secondary: "border border-accent bg-accent text-white hover:border-primary hover:bg-primary",
  outline: "liquid-card border-white/60 bg-white/50 text-primary hover:border-primary/20 hover:bg-white/80"
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
