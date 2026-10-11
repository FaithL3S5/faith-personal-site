import { describe, expect, it } from "vitest";
import { waveFillForScroll, waveFrontInBand } from "@/lib/motion/waveFill";

describe("waveFill", () => {
  it("is empty at the top and fills over the first three quarters of a screen", () => {
    expect(waveFillForScroll(0, 5000, 800)).toBe(0);
    expect(waveFillForScroll(300, 5000, 800)).toBeCloseTo(0.5);
    expect(waveFillForScroll(600, 5000, 800)).toBe(1);
    expect(waveFillForScroll(3000, 5000, 800)).toBe(1);
  });

  it("fills over whatever scroll a short page has", () => {
    expect(waveFillForScroll(100, 200, 800)).toBeCloseTo(0.5);
    expect(waveFillForScroll(200, 200, 800)).toBe(1);
  });

  it("is full on a page that cannot scroll", () => {
    expect(waveFillForScroll(0, 0, 800)).toBe(1);
  });

  it("places the wave front below the top of the viewport by the fill share", () => {
    expect(waveFrontInBand(-1200, 0, 800)).toBe(1200);
    expect(waveFrontInBand(-1200, 0.5, 800)).toBe(1600);
  });
});
