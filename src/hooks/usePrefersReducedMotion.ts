"use client";

import { useSyncExternalStore } from "react";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => null,
  );
}
