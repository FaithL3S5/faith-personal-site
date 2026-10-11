import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { WaveBands } from "@/components/layout/WaveBands/WaveBands";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function readStates(container: HTMLElement) {
  return [...container.querySelectorAll("span")].map((band) => band.getAttribute("data-wave-state"));
}

describe("WaveBands", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rests faint, shows while scrolling, and rests again a second after scrolling stops", () => {
    const { container, unmount } = render(<WaveBands leftClassName="left" rightClassName="right" />);
    expect(readStates(container)).toEqual(["resting", "resting"]);

    fireEvent.scroll(window);
    expect(readStates(container)).toEqual(["scrolling", "scrolling"]);

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(readStates(container)).toEqual(["scrolling", "scrolling"]);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(readStates(container)).toEqual(["resting", "resting"]);

    unmount();
  });

  it("stays at full strength with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<WaveBands leftClassName="left" rightClassName="right" />);

    fireEvent.scroll(window);
    expect(readStates(container)).toEqual([null, null]);
  });
});
