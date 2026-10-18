import { describe, expect, it } from "vitest";
import { flightOf, launchSpeedFor, spinSpeedFor } from "@/lib/softbody/ballistics";

const step = 1 / 120;
const withoutDrag = { gravity: 2400, damping: 1, stepSeconds: step };
const withDrag = { gravity: 2400, damping: 0.995, stepSeconds: step };

describe("ballistics", () => {
  it("matches a plain throw when there is no drag", () => {
    const flight = flightOf(1000, withoutDrag);
    expect(flight.peakHeight).toBeCloseTo(1000 ** 2 / (2 * 2400), -1);
    expect(flight.seconds).toBeCloseTo((2 * 1000) / 2400, 1);
  });

  it("flies lower and shorter with drag", () => {
    expect(flightOf(1000, withDrag).peakHeight).toBeLessThan(flightOf(1000, withoutDrag).peakHeight);
    expect(flightOf(1000, withDrag).seconds).toBeLessThan(flightOf(1000, withoutDrag).seconds);
  });

  it("finds the launch speed that reaches a given height", () => {
    expect(flightOf(launchSpeedFor(350, withDrag), withDrag).peakHeight).toBeCloseTo(350, 0);
  });

  it("spins faster with drag so the turn still finishes in time", () => {
    expect(spinSpeedFor(Math.PI, 1, withoutDrag)).toBeCloseTo(Math.PI);
    expect(spinSpeedFor(Math.PI, 1, withDrag)).toBeGreaterThan(Math.PI);
  });
});
