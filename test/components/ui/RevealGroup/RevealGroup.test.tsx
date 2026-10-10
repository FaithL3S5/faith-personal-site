import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { RevealGroup } from "@/components/ui/RevealGroup/RevealGroup";
import { hasPlayed, resetPlayedKeys } from "@/lib/motion/playOnce";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

describe("RevealGroup", () => {
  beforeEach(() => {
    resetPlayedKeys();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays on load after the first frame of the page", () => {
    vi.useFakeTimers();
    render(
      <RevealGroup playKey="load-group" trigger="load" staggerMs={80} className="group">
        <p data-reveal-item="">Hello</p>
      </RevealGroup>,
    );

    expect(screen.getByText("Hello").style.opacity).toBe("0");
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(hasPlayed("load-group")).toBe(true);
  });

  it("waits for the group to scroll into view", () => {
    const { container } = render(
      <RevealGroup playKey="view-group" trigger="view" staggerMs={80}>
        <p data-reveal-item="">Footer</p>
      </RevealGroup>,
    );

    triggerIntersection(container.firstElementChild as Element, false);
    expect(hasPlayed("view-group")).toBe(false);

    triggerIntersection(container.firstElementChild as Element, true);
    expect(hasPlayed("view-group")).toBe(true);
  });

  it("does nothing with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    render(
      <RevealGroup playKey="still-group" trigger="view" staggerMs={80}>
        <p data-reveal-item="">Still</p>
      </RevealGroup>,
    );
    expect(screen.getByText("Still").style.opacity).toBe("");
  });
});
