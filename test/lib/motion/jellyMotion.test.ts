import { describe, expect, it } from "vitest";
import { clampEyeOffset, nextBlinkDelayMs, randomEyeOffset } from "@/lib/motion/jellyMotion";

describe("jellyMotion", () => {
  it("blinks every 3 to 6 seconds", () => {
    expect(nextBlinkDelayMs(() => 0)).toBe(3000);
    expect(nextBlinkDelayMs(() => 0.999)).toBeCloseTo(5997);
  });

  it("keeps small eye offsets and clamps large ones to the face", () => {
    const bounds = { horizontal: 200, up: 110, down: 320 };
    expect(clampEyeOffset(30, 40, bounds)).toEqual({ x: 30, y: 40 });

    const clamped = clampEyeOffset(3000, 4000, bounds);
    expect(Math.hypot(clamped.x / 200, clamped.y / 320)).toBeCloseTo(1);
    expect(clamped.x / clamped.y).toBeCloseTo(0.75);
  });

  it("lets the eyes travel further down than up", () => {
    const bounds = { horizontal: 200, up: 110, down: 320 };
    expect(clampEyeOffset(0, 5000, bounds).y).toBeCloseTo(320);
    expect(clampEyeOffset(0, -5000, bounds).y).toBeCloseTo(-110);
  });

  it("drifts somewhere between half and the full offset", () => {
    const offset = randomEyeOffset(150, () => 0);
    expect(offset).toEqual({ x: 75, y: 0 });
    const farOffset = randomEyeOffset(150, () => 0.999);
    expect(Math.hypot(farOffset.x, farOffset.y)).toBeLessThanOrEqual(150);
  });
});
