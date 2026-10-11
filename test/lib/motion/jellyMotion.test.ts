import { describe, expect, it } from "vitest";
import {
  clampEyeOffset,
  keepUnderSlopingTop,
  nextBlinkDelayMs,
  randomEyeOffset,
} from "@/lib/motion/jellyMotion";

describe("jellyMotion", () => {
  it("blinks every 3 to 6 seconds", () => {
    expect(nextBlinkDelayMs(() => 0)).toBe(3000);
    expect(nextBlinkDelayMs(() => 0.999)).toBeCloseTo(5997);
  });

  const bounds = { left: 560, right: 280, up: 110, down: 320 };

  it("keeps small eye offsets and clamps large ones to the body", () => {
    expect(clampEyeOffset(30, 40, bounds)).toEqual({ x: 30, y: 40 });

    const clamped = clampEyeOffset(3000, 4000, bounds);
    expect(Math.hypot(clamped.x / 280, clamped.y / 320)).toBeCloseTo(1);
    expect(clamped.x / clamped.y).toBeCloseTo(0.75);
  });

  it("gives each direction its own reach", () => {
    expect(clampEyeOffset(-5000, 0, bounds).x).toBeCloseTo(-560);
    expect(clampEyeOffset(5000, 0, bounds).x).toBeCloseTo(280);
    expect(clampEyeOffset(0, 5000, bounds).y).toBeCloseTo(320);
    expect(clampEyeOffset(0, -5000, bounds).y).toBeCloseTo(-110);
  });

  it("dips the eyes as they look left, following the sloping top of the body", () => {
    expect(keepUnderSlopingTop({ x: 0, y: -110 }, bounds, 90)).toEqual({ x: 0, y: -110 });
    expect(keepUnderSlopingTop({ x: -280, y: -110 }, bounds, 90)).toEqual({ x: -280, y: -10 });
    expect(keepUnderSlopingTop({ x: -560, y: 0 }, bounds, 90)).toEqual({ x: -560, y: 90 });
    expect(keepUnderSlopingTop({ x: 200, y: -110 }, bounds, 90)).toEqual({ x: 200, y: -110 });
  });

  it("drifts somewhere between half and the full offset", () => {
    const offset = randomEyeOffset(150, () => 0);
    expect(offset).toEqual({ x: 75, y: 0 });
    const farOffset = randomEyeOffset(150, () => 0.999);
    expect(Math.hypot(farOffset.x, farOffset.y)).toBeLessThanOrEqual(150);
  });
});
