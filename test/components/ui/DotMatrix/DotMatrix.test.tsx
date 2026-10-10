import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as anime from "animejs";
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

  it("stays still with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<DotMatrix columns={3} rows={2} circleLeft={0} tone="paper" />);

    fireEvent.pointerDown(container.querySelector("svg") as SVGSVGElement);
    expect(anime.animate).not.toHaveBeenCalled();
  });
});
