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
  default: "bg-white text-primary hover:bg-accent hover:text-white",
  secondary: "bg-accent text-white hover:bg-white hover:text-primary",
  outline: "border border-white/30 bg-transparent text-white hover:bg-white hover:text-primary"
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-6 py-2",
  lg: "h-12 px-8 text-base"
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
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
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
