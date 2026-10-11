import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { HeroLetterPanel } from "@/features/home/HeroLetterPanel/HeroLetterPanel";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function readState(container: HTMLElement) {
  return {
    letter: container.querySelector("[data-hero-letter]")?.textContent,
    active: container.querySelector("[data-active]")?.textContent,
    counter: container.querySelector("[data-hero-counter]")?.textContent,
  };
}

function advanceBeats(beats: number) {
  act(() => {
    vi.advanceTimersByTime(560 * beats);
  });
}

describe("HeroLetterPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("loops F, A, I, T, H on a 560ms beat while the hero is on screen", () => {
    const { container } = render(<HeroLetterPanel />);
    act(() => triggerIntersection(container.firstElementChild as Element, true));

    advanceBeats(1);
    expect(readState(container)).toEqual({ letter: "A", active: "A", counter: "02 / 05" });

    advanceBeats(3);
    expect(readState(container)).toEqual({ letter: "H", active: "H", counter: "05 / 05" });

    advanceBeats(2);
    expect(readState(container)).toEqual({ letter: "A", active: "A", counter: "02 / 05" });
  });

  it("pauses while the hero is out of view", () => {
    const { container } = render(<HeroLetterPanel />);
    const panel = container.firstElementChild as Element;
    act(() => triggerIntersection(panel, true));
    advanceBeats(1);

    act(() => triggerIntersection(panel, false));
    advanceBeats(3);
    expect(readState(container).letter).toBe("A");
  });

  it("stays on F with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<HeroLetterPanel />);
    act(() => triggerIntersection(container.firstElementChild as Element, true));

    advanceBeats(2);
    expect(readState(container)).toEqual({ letter: "F", active: "F", counter: "01 / 05" });
  });
});
