import { describe, expect, it } from "vitest";
import { nextWaveFill, waveFrontInBand } from "@/lib/motion/waveFill";

describe("waveFill", () => {
  it("fills as the page scrolls down and drains as it scrolls up", () => {
    expect(nextWaveFill(0, 300, 800)).toBeCloseTo(0.5);
    expect(nextWaveFill(0.5, -150, 800)).toBeCloseTo(0.25);
  });

  it("stays between empty and full", () => {
    expect(nextWaveFill(0.9, 5000, 800)).toBe(1);
    expect(nextWaveFill(0.1, -5000, 800)).toBe(0);
  });

  it("places the wave front below the top of the viewport by the fill share", () => {
    expect(waveFrontInBand(-1200, 0, 800)).toBe(1200);
    expect(waveFrontInBand(-1200, 0.5, 800)).toBe(1600);
  });
});
