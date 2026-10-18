import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

describe("usePrefersReducedMotion", () => {
  it("reads the reduced motion preference", () => {
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);

    setMediaQueryMatches(reducedMotionQuery, true);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(true);
  });
});
