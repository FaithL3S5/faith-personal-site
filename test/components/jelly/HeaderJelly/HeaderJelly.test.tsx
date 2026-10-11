import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as anime from "animejs";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { HeaderJelly } from "@/components/jelly/HeaderJelly/HeaderJelly";

vi.mock("animejs", { spy: true });

describe("HeaderJelly", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("drifts the eyes away and back while on screen", () => {
    render(<HeaderJelly className="jelly" />);
    const figure = screen.getByRole("img", { name: "Jelly, the mascot, looking around" });
    act(() => triggerIntersection(figure, true));

    act(() => {
      vi.advanceTimersByTime(4500 + 1400);
    });
    const driftTargets = vi
      .mocked(anime.animate)
      .mock.calls.map(([, params]) => params as { translateX?: number })
      .filter((params) => params.translateX !== undefined);
    expect(driftTargets.at(-1)?.translateX).toBe(0);
    expect(driftTargets.length).toBeGreaterThanOrEqual(2);
  });
});
