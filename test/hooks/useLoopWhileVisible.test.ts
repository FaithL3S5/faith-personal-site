import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { useLoopWhileVisible } from "@/hooks/useLoopWhileVisible";

function setVisibility(visibilityState: DocumentVisibilityState) {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue(visibilityState);
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useLoopWhileVisible", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("ticks only while the target is in view and the tab is visible", () => {
    const target = document.createElement("div");
    const onTick = vi.fn();
    const { unmount } = renderHook(() => useLoopWhileVisible({ current: target }, onTick, 100));

    vi.advanceTimersByTime(300);
    expect(onTick).not.toHaveBeenCalled();

    triggerIntersection(target, true);
    vi.advanceTimersByTime(300);
    expect(onTick).toHaveBeenCalledTimes(3);

    setVisibility("hidden");
    vi.advanceTimersByTime(300);
    expect(onTick).toHaveBeenCalledTimes(3);

    setVisibility("visible");
    vi.advanceTimersByTime(100);
    expect(onTick).toHaveBeenCalledTimes(4);

    unmount();
    vi.advanceTimersByTime(300);
    expect(onTick).toHaveBeenCalledTimes(4);
  });
});
