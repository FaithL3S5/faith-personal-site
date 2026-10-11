import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { HeroJelly } from "@/components/jelly/HeroJelly/HeroJelly";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";

function firstEyeY() {
  return Number(screen.getByRole("img").querySelector("[data-jelly-eyes] circle")?.getAttribute("cy"));
}

describe("HeroJelly", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("loops looking down, then neutral, then looking down again", () => {
    render(<HeroJelly className="jelly" />);
    act(() => triggerIntersection(screen.getByRole("img"), true));
    expect(firstEyeY()).toBe(eyeCenters.rightLookingDown[0].y);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(firstEyeY()).toBe(eyeCenters.rightNeutral[0].y);

    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(firstEyeY()).toBe(eyeCenters.rightLookingDown[0].y);
  });
});
