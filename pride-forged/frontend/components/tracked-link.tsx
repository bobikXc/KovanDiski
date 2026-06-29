"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { reachGoal } from "@/lib/metrika";

type TrackingProps = {
  goal: string;
  params?: Record<string, unknown>;
  children: ReactNode;
};

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "onClick"> &
  TrackingProps;

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & TrackingProps;

export function TrackedLink({ goal, params, children, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={() => {
        reachGoal(goal, params);
      }}
    >
      {children}
    </Link>
  );
}

export function TrackedAnchor({ goal, params, children, ...props }: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={() => {
        reachGoal(goal, params);
      }}
    >
      {children}
    </a>
  );
}
