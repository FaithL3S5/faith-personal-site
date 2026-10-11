"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export function useLoopWhileVisible(
  targetRef: RefObject<Element | null>,
  onTick: () => void,
  intervalMs: number,
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || prefersReducedMotion()) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let isInView = false;

    const stop = () => {
      clearInterval(intervalId);
      intervalId = undefined;
    };
    const syncLoop = () => {
      const shouldRun = isInView && document.visibilityState === "visible";
      if (shouldRun && !intervalId) intervalId = setInterval(onTick, intervalMs);
      if (!shouldRun) stop();
    };

    const observer = new IntersectionObserver((entries) => {
      isInView = entries.some((entry) => entry.isIntersecting);
      syncLoop();
    });
    observer.observe(target);
    document.addEventListener("visibilitychange", syncLoop);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncLoop);
    };
  }, [targetRef, onTick, intervalMs]);
}
