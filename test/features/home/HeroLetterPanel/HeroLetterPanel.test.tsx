import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { HeroLetterPanel } from "@/features/home/HeroLetterPanel/HeroLetterPanel";
import { resetPlayedKeys } from "@/lib/motion/playOnce";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function readState(container: HTMLElement) {
  return {
    letter: container.querySelector("[data-hero-letter]")?.textContent,
    active: container.querySelector("[data-active]")?.textContent,
    counter: container.querySelector("[data-hero-counter]")?.textContent,
  };
}

describe("HeroLetterPanel", () => {
  beforeEach(() => {
    resetPlayedKeys();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("steps through F, A, I, T, H on a 560ms beat and settles back on F", () => {
    const { container } = render(<HeroLetterPanel />);

    act(() => {
      vi.advanceTimersByTime(560);
    });
    expect(readState(container)).toEqual({ letter: "A", active: "A", counter: "02 / 05" });

    act(() => {
      vi.advanceTimersByTime(560 * 3);
    });
    expect(readState(container)).toEqual({ letter: "H", active: "H", counter: "05 / 05" });

    act(() => {
      vi.advanceTimersByTime(560);
    });
    expect(readState(container)).toEqual({ letter: "F", active: "F", counter: "01 / 05" });
  });

  it("plays only once per page load", () => {
    const first = render(<HeroLetterPanel />);
    act(() => {
      vi.advanceTimersByTime(560 * 6);
    });
    first.unmount();

    const { container } = render(<HeroLetterPanel />);
    act(() => {
      vi.advanceTimersByTime(560);
    });
    expect(readState(container).letter).toBe("F");
  });

  it("stays on F with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<HeroLetterPanel />);

    act(() => {
      vi.advanceTimersByTime(560 * 2);
    });
    expect(readState(container)).toEqual({ letter: "F", active: "F", counter: "01 / 05" });
  });
});
