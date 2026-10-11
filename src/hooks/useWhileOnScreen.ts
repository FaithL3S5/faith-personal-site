"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

type StopActivity = () => void;

export function useWhileOnScreen(
  targetRef: RefObject<Element | null>,
  startActivity: () => StopActivity,
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || prefersReducedMotion()) return;

    let stopActivity: StopActivity | undefined;
    let isInView = false;

    const syncActivity = () => {
      const shouldRun = isInView && document.visibilityState === "visible";
      if (shouldRun && !stopActivity) stopActivity = startActivity();
      if (!shouldRun && stopActivity) {
        stopActivity();
        stopActivity = undefined;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      isInView = entries.some((entry) => entry.isIntersecting);
      syncActivity();
    });
    observer.observe(target);
    document.addEventListener("visibilitychange", syncActivity);

    return () => {
      stopActivity?.();
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncActivity);
    };
  }, [targetRef, startActivity]);
}
