"use client";

import { animate, createScope, stagger, utils } from "animejs";
import { useEffect, type RefObject } from "react";
import { durations, easeOut, riseDistance } from "@/lib/motion/motionTokens";
import { hasPlayed, markPlayed } from "@/lib/motion/playOnce";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export const revealItemSelector = "[data-reveal-item]";

type RevealGroupOptions = {
  playKey: string;
  trigger: "load" | "view";
  staggerMs: number;
};

export function useRevealGroup(
  containerRef: RefObject<HTMLElement | null>,
  { playKey, trigger, staggerMs }: RevealGroupOptions,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasPlayed(playKey) || prefersReducedMotion()) return;

    const scope = createScope({ root: container }).add((self) => {
      utils.set(revealItemSelector, { opacity: 0, translateY: riseDistance });
      self?.add("reveal", () => {
        markPlayed(playKey);
        animate(revealItemSelector, {
          opacity: 1,
          translateY: "0rem",
          duration: durations.base,
          ease: easeOut,
          delay: stagger(staggerMs),
        });
      });
    });

    if (trigger === "load") {
      const timeoutId = setTimeout(() => scope.methods.reveal(), 0);
      return () => {
        clearTimeout(timeoutId);
        scope.revert();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        scope.methods.reveal();
      },
      { threshold: 0.2 },
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
      scope.revert();
    };
  }, [containerRef, playKey, trigger, staggerMs]);
}
