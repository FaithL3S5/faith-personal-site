import { describe, expect, it } from "vitest";
import { createFixedStepper } from "@/lib/softbody/fixedStep";

function stepsOver(frameMs: number, frames: number) {
  const stepper = createFixedStepper(120, 8);
  let steps = 0;
  const alphas: number[] = [];
  for (let frame = 0; frame < frames; frame++) {
    const result = stepper.advance(frameMs);
    steps += result.steps;
    alphas.push(result.alpha);
  }
  return { steps, alphas };
}

describe("createFixedStepper", () => {
  it("runs the same number of physics steps for the same time at any frame rate", () => {
    const sixty = stepsOver(1000 / 60, 60).steps;
    const oneTwenty = stepsOver(1000 / 120, 120).steps;
    const oneFortyFour = stepsOver(1000 / 144, 144).steps;

    expect(Math.abs(sixty - 120)).toBeLessThanOrEqual(1);
    expect(Math.abs(oneTwenty - 120)).toBeLessThanOrEqual(1);
    expect(Math.abs(oneFortyFour - 120)).toBeLessThanOrEqual(1);
  });

  it("keeps the leftover fraction between 0 and 1", () => {
    for (const alpha of stepsOver(1000 / 144, 50).alphas) {
      expect(alpha).toBeGreaterThanOrEqual(0);
      expect(alpha).toBeLessThanOrEqual(1);
    }
  });

  it("limits the catch-up after a long pause", () => {
    const stepper = createFixedStepper(120, 8);
    expect(stepper.advance(5000).steps).toBe(8);
    expect(stepper.advance(1000 / 120).steps).toBeLessThanOrEqual(2);
  });

  it("reports the step length in seconds", () => {
    expect(createFixedStepper(120, 8).stepSeconds).toBeCloseTo(1 / 120);
  });
});
