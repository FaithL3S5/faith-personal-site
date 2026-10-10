export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia(reducedMotionQuery).matches;
}
