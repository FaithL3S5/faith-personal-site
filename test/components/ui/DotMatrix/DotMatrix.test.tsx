import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as anime from "animejs";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

vi.mock("animejs", { spy: true });

describe("DotMatrix", () => {
  it("draws one dot per grid cell plus the crimson circle", () => {
    const { container } = render(<DotMatrix columns={11} rows={6} circleLeft={105} tone="ink" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.querySelectorAll("[data-column]")).toHaveLength(66);
    expect(svg?.style.width).toBe("9.625rem");
  });

  it("ripples once per pointer entry and ignores triggers until it finishes", () => {
    vi.useFakeTimers();
    const { container } = render(<DotMatrix columns={3} rows={2} circleLeft={0} tone="paper" />);
    const svg = container.querySelector("svg") as SVGSVGElement;

    fireEvent.pointerDown(svg, { clientX: 0, clientY: 0 });
    fireEvent.pointerDown(svg, { clientX: 0, clientY: 0 });
    expect(anime.animate).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    fireEvent.pointerDown(svg, { clientX: 0, clientY: 0 });
    expect(anime.animate).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("sweeps a wave left to right while on screen and pauses it during a pointer ripple", () => {
    vi.useFakeTimers();
    const { container } = render(<DotMatrix columns={3} rows={2} circleLeft={0} tone="ink" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    vi.spyOn(svg, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 42, 28));
    triggerIntersection(svg, true);

    vi.advanceTimersByTime(2400);
    expect(anime.animate).toHaveBeenCalledTimes(1);
    const waveDelay = vi.mocked(anime.animate).mock.calls[0][1].delay as (
      target: unknown,
      index: number,
    ) => number;
    expect([0, 1, 2, 3, 4, 5].map((index) => waveDelay(null, index))).toEqual([0, 30, 60, 0, 30, 60]);

    vi.advanceTimersByTime(2300);
    fireEvent.pointerDown(svg, { clientX: 0, clientY: 0 });
    vi.advanceTimersByTime(100);
    expect(anime.animate).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(2400);
    expect(anime.animate).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it("stays still with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<DotMatrix columns={3} rows={2} circleLeft={0} tone="paper" />);

    fireEvent.pointerDown(container.querySelector("svg") as SVGSVGElement);
    expect(anime.animate).not.toHaveBeenCalled();
  });
});
