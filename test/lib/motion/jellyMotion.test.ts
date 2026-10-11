import { describe, expect, it } from "vitest";
import { clampEyeOffset, nextBlinkDelayMs, randomEyeOffset } from "@/lib/motion/jellyMotion";

describe("jellyMotion", () => {
  it("blinks every 3 to 6 seconds", () => {
    expect(nextBlinkDelayMs(() => 0)).toBe(3000);
    expect(nextBlinkDelayMs(() => 0.999)).toBeCloseTo(5997);
  });

  it("keeps small eye offsets and clamps large ones to the face", () => {
    expect(clampEyeOffset(30, 40, 110)).toEqual({ x: 30, y: 40 });
    const clamped = clampEyeOffset(300, 400, 110);
    expect(Math.hypot(clamped.x, clamped.y)).toBeCloseTo(110);
    expect(clamped.x / clamped.y).toBeCloseTo(0.75);
  });

  it("drifts somewhere between half and the full offset", () => {
    const offset = randomEyeOffset(150, () => 0);
    expect(offset).toEqual({ x: 75, y: 0 });
    const farOffset = randomEyeOffset(150, () => 0.999);
    expect(Math.hypot(farOffset.x, farOffset.y)).toBeLessThanOrEqual(150);
  });
});
