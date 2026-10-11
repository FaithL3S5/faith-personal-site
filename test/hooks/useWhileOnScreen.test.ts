import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function setVisibility(visibilityState: DocumentVisibilityState) {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue(visibilityState);
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useWhileOnScreen", () => {
  it("starts when in view and stops when hidden, out of view, or unmounted", () => {
    const target = document.createElement("div");
    const stopActivity = vi.fn();
    const startActivity = vi.fn(() => stopActivity);
    const { unmount } = renderHook(() => useWhileOnScreen({ current: target }, startActivity));

    triggerIntersection(target, true);
    triggerIntersection(target, true);
    expect(startActivity).toHaveBeenCalledTimes(1);

    setVisibility("hidden");
    expect(stopActivity).toHaveBeenCalledTimes(1);

    setVisibility("visible");
    expect(startActivity).toHaveBeenCalledTimes(2);

    triggerIntersection(target, false);
    expect(stopActivity).toHaveBeenCalledTimes(2);

    triggerIntersection(target, true);
    unmount();
    expect(stopActivity).toHaveBeenCalledTimes(3);
  });

  it("never starts with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const target = document.createElement("div");
    const startActivity = vi.fn(() => () => {});
    renderHook(() => useWhileOnScreen({ current: target }, startActivity));

    triggerIntersection(target, true);
    expect(startActivity).not.toHaveBeenCalled();
  });
});
