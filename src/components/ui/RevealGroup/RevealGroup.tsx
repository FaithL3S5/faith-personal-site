"use client";

import { useRef, type ReactNode } from "react";
import { useRevealGroup } from "@/hooks/useRevealGroup";

type RevealGroupProps = {
  playKey: string;
  trigger: "load" | "view";
  staggerMs: number;
  className?: string;
  children: ReactNode;
};

export function RevealGroup({ playKey, trigger, staggerMs, className, children }: RevealGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useRevealGroup(containerRef, { playKey, trigger, staggerMs });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
