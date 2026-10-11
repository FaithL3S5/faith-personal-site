import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as anime from "animejs";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { useJellyBlink } from "@/hooks/useJellyBlink";

vi.mock("animejs", { spy: true });

function BlinkingFigure({ isPaused }: { isPaused?: boolean }) {
  const figureRef = useRef<SVGSVGElement>(null);
  useJellyBlink(figureRef, isPaused);
  return (
    <svg ref={figureRef} data-testid="figure">
      <g data-jelly-eyes="" />
    </svg>
  );
}

describe("useJellyBlink", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("blinks every few seconds while on screen", () => {
    const { getByTestId } = render(<BlinkingFigure />);
    act(() => triggerIntersection(getByTestId("figure"), true));

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(anime.animate).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(anime.animate).toHaveBeenCalledTimes(2);
  });

  it("holds the blink while paused", () => {
    const { getByTestId } = render(<BlinkingFigure isPaused />);
    act(() => triggerIntersection(getByTestId("figure"), true));

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(anime.animate).not.toHaveBeenCalled();
  });
});
